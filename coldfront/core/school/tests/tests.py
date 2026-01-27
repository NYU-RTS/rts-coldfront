from io import StringIO

from django.contrib.auth.models import Permission
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.test import TestCase

from coldfront.core.project.models import ProjectUser
from coldfront.core.school.models import School
from coldfront.core.test_helpers.factories import (
    ProjectFactory,
    ProjectStatusChoiceFactory,
    ProjectUserRoleChoiceFactory,
    ProjectUserStatusChoiceFactory,
    SchoolFactory,
    UserFactory,
)
from coldfront.core.user.models import ApproverProfile


class TestSchool(TestCase):
    class Data:
        """Collection of test data, separated for readability"""

        def __init__(self):
            self.initial_fields = {
                "pk": 11,
                "description": "Rory Meyers College of Nursing",
            }

            self.unsaved_object = School(**self.initial_fields)

    def setUp(self):
        self.data = self.Data()
        SchoolFactory()

    def test_fields_generic(self):
        self.assertEqual(1, len(School.objects.all()))

        school_obj = self.data.unsaved_object
        school_obj.save()

        self.assertEqual(2, len(School.objects.all()))

        retrieved_school = School.objects.get(pk=school_obj.pk)

        for item in self.data.initial_fields.items():
            (field, initial_value) = item
            with self.subTest(item=item):
                saved_value = getattr(retrieved_school, field)
                self.assertEqual(initial_value, saved_value)
        self.assertEqual(school_obj, retrieved_school)

    def test_description_maxlength(self):
        expected_maximum_length = 255
        maximum_description = "x" * expected_maximum_length

        school_obj = self.data.unsaved_object

        school_obj.description = maximum_description + "x"
        with self.assertRaises(ValidationError):
            school_obj.clean_fields()

        school_obj.description = maximum_description
        school_obj.clean_fields()
        school_obj.save()

        retrieved_obj = School.objects.get(pk=school_obj.pk)
        self.assertEqual(maximum_description, retrieved_obj.description)


class TestAddSchoolApproverToAllProjectsCommand(TestCase):
    """Test the add_school_approver_to_all_projects management command."""

    def setUp(self):
        """Set up test data."""
        # Create required ProjectUserRoleChoice and ProjectUserStatusChoice objects
        self.manager_role = ProjectUserRoleChoiceFactory(name="Manager")
        self.user_role = ProjectUserRoleChoiceFactory(name="User")
        self.active_status = ProjectUserStatusChoiceFactory(name="Active")
        self.project_status = ProjectStatusChoiceFactory(name="Active")

        # Create test school
        self.school = SchoolFactory(description="Test School")

        # Create a separate PI user who will own the projects (different from approver)
        self.pi_user = UserFactory(username="pi_researcher")
        self.pi_profile = self.pi_user.userprofile
        self.pi_profile.is_pi = True
        self.pi_profile.save()

        # Create test approver user with proper permissions (different from PI)
        self.approver = UserFactory(username="approver123")
        permission = Permission.objects.get(codename="can_review_allocation_requests")
        self.approver.user_permissions.add(permission)

        # Get the automatically created UserProfile and set is_pi to True
        self.approver_profile = self.approver.userprofile
        self.approver_profile.is_pi = True
        self.approver_profile.save()

        # Create ApproverProfile for the approver
        self.approver_profile_extended = ApproverProfile.objects.create(user_profile=self.approver_profile)
        self.approver_profile_extended.schools.add(self.school)

        # Create test projects associated with the school, owned by the PI (not the approver)
        self.project1 = ProjectFactory(
            pi=self.pi_user,
            school=self.school,
            title="Test Project 1",
            status=self.project_status
        )
        self.project2 = ProjectFactory(
            pi=self.pi_user,
            school=self.school,
            title="Test Project 2",
            status=self.project_status
        )

        # Create a project in a different school with a different PI
        self.other_school = SchoolFactory(description="Other School")
        self.other_pi = UserFactory(username="other_pi")
        self.other_pi.userprofile.is_pi = True
        self.other_pi.userprofile.save()
        self.project3 = ProjectFactory(
            pi=self.other_pi,
            school=self.other_school,
            title="Other Project",
            status=self.project_status
        )

        # Create another user (not an approver)
        self.regular_user = UserFactory(username="regular456")

    def test_command_adds_approver_to_projects_successfully(self):
        """Test that the command successfully adds an approver to all projects in their school.
        The approver should be added as a Manager to projects owned by other PIs."""
        # Verify setup: approver and PI are different users
        self.assertNotEqual(self.approver, self.pi_user)
        self.assertEqual(self.project1.pi, self.pi_user)
        self.assertEqual(self.project2.pi, self.pi_user)

        # Verify approver is not initially in projects
        self.assertFalse(ProjectUser.objects.filter(
            user=self.approver,
            project=self.project1
        ).exists())
        self.assertFalse(ProjectUser.objects.filter(
            user=self.approver,
            project=self.project2
        ).exists())

        # Run the command
        out = StringIO()
        call_command(
            "add_school_approver_to_all_projects",
            "--username", "approver123",
            "--school", "Test School",
            stdout=out
        )

        # Verify approver was added to projects with Manager role
        project_user_1 = ProjectUser.objects.get(user=self.approver, project=self.project1)
        self.assertEqual(project_user_1.role.name, "Manager")
        self.assertEqual(project_user_1.status.name, "Active")

        project_user_2 = ProjectUser.objects.get(user=self.approver, project=self.project2)
        self.assertEqual(project_user_2.role.name, "Manager")
        self.assertEqual(project_user_2.status.name, "Active")

        # Verify approver was NOT added to project in other school
        self.assertFalse(ProjectUser.objects.filter(
            user=self.approver,
            project=self.project3
        ).exists())

        # Verify that the PI is different from the approver and still owns the projects
        self.assertNotEqual(self.pi_user, self.approver)
        self.assertEqual(self.project1.pi, self.pi_user)
        self.assertEqual(self.project2.pi, self.pi_user)

    def test_command_with_dry_run(self):
        """Test that dry run mode doesn't make actual changes."""
        # Run the command with dry run
        out = StringIO()
        call_command(
            "add_school_approver_to_all_projects",
            "--username", "approver123",
            "--school", "Test School",
            "--dry-run",
            stdout=out
        )

        # Verify no changes were made
        self.assertFalse(ProjectUser.objects.filter(
            user=self.approver,
            project=self.project1
        ).exists())
        self.assertFalse(ProjectUser.objects.filter(
            user=self.approver,
            project=self.project2
        ).exists())

    def test_command_skips_projects_where_approver_already_exists(self):
        """Test that command skips projects where approver is already a member."""
        # Add approver to one project with User role
        ProjectUser.objects.create(
            user=self.approver,
            project=self.project1,
            role=self.user_role,
            status=self.active_status
        )

        initial_project_users_count = ProjectUser.objects.filter(project=self.project1).count()

        # Run the command
        out = StringIO()
        call_command(
            "add_school_approver_to_all_projects",
            "--username", "approver123",
            "--school", "Test School",
            stdout=out
        )

        # Verify no additional ProjectUser was created for project1
        final_project_users_count = ProjectUser.objects.filter(project=self.project1).count()
        self.assertEqual(initial_project_users_count, final_project_users_count)

        # Verify the existing role wasn't changed
        existing_project_user = ProjectUser.objects.get(user=self.approver, project=self.project1)
        self.assertEqual(existing_project_user.role.name, "User")

        # Verify approver was still added to project2
        self.assertTrue(ProjectUser.objects.filter(
            user=self.approver,
            project=self.project2,
            role=self.manager_role
        ).exists())

    def test_command_fails_with_nonexistent_user(self):
        """Test that command handles non-existent users gracefully."""
        out = StringIO()

        # The command catches exceptions and logs them, so it should run without raising
        call_command(
            "add_school_approver_to_all_projects",
            "--username", "nonexistent",
            "--school", "Test School",
            stdout=out
        )

        # Verify no changes were made to any existing projects (approver should not be added)
        self.assertFalse(ProjectUser.objects.filter(
            user=self.approver,
            project=self.project1
        ).exists())
        self.assertFalse(ProjectUser.objects.filter(
            user=self.approver,
            project=self.project2
        ).exists())

    def test_command_fails_with_nonexistent_school(self):
        """Test that command handles non-existent schools gracefully."""
        out = StringIO()

        # The command catches exceptions and logs them, so it should run without raising
        call_command(
            "add_school_approver_to_all_projects",
            "--username", "approver123",
            "--school", "Nonexistent School",
            stdout=out
        )

        # Verify no changes were made to any existing projects
        self.assertFalse(ProjectUser.objects.filter(
            user=self.approver,
            project=self.project1
        ).exists())
        self.assertFalse(ProjectUser.objects.filter(
            user=self.approver,
            project=self.project2
        ).exists())

    def test_command_warns_when_user_not_approver_for_school(self):
        """Test that command warns and exits when user is not an approver for the specified school."""
        # Create an approver for a different school
        other_approver = UserFactory(username="other_approver")
        permission = Permission.objects.get(codename="can_review_allocation_requests")
        other_approver.user_permissions.add(permission)

        # Get the automatically created UserProfile and set is_pi to True
        other_approver_profile = other_approver.userprofile
        other_approver_profile.is_pi = True
        other_approver_profile.save()

        other_approver_profile_extended = ApproverProfile.objects.create(user_profile=other_approver_profile)
        other_approver_profile_extended.schools.add(self.other_school)

        # Run command trying to add other_approver to Test School projects
        out = StringIO()
        call_command(
            "add_school_approver_to_all_projects",
            "--username", "other_approver",
            "--school", "Test School",
            stdout=out
        )

        # Verify no changes were made
        self.assertFalse(ProjectUser.objects.filter(
            user=other_approver,
            project=self.project1
        ).exists())
        self.assertFalse(ProjectUser.objects.filter(
            user=other_approver,
            project=self.project2
        ).exists())

    def test_command_handles_user_without_approver_profile(self):
        """Test that command handles users without ApproverProfile gracefully."""
        # Create a user without ApproverProfile (UserProfile is auto-created by signal)
        regular_user_with_profile = UserFactory(username="regular_with_profile")
        # UserProfile exists but no ApproverProfile created

        # Run command
        out = StringIO()
        call_command(
            "add_school_approver_to_all_projects",
            "--username", "regular_with_profile",
            "--school", "Test School",
            stdout=out
        )

        # Verify no changes were made
        self.assertFalse(ProjectUser.objects.filter(
            user=regular_user_with_profile,
            project=self.project1
        ).exists())
