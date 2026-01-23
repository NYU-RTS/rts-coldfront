import argparse
import logging

from django.core.management.base import BaseCommand

from coldfront.core.project.models import Project, ProjectUser, ProjectUserRoleChoice
from coldfront.core.school.models import School
from coldfront.core.user.models import User
from coldfront.core.utils.common import import_from_settings

logger = logging.getLogger(__name__)

GENERAL_RESOURCE_NAME = import_from_settings("GENERAL_RESOURCE_NAME")
CENTER_BASE_URL = import_from_settings("CENTER_BASE_URL")


class Command(BaseCommand):
    help = "Add a school approver to all projects associated with \
            that school as a manager"

    def add_arguments(self, parser):
        parser.add_argument(
            "-u",
            "--username",
            type=str,
            help="Username (NetID) \
                            of school approver",
        )
        parser.add_argument(
            "-s",
            "--school",
            type=str,
            help="School, i.e. projects associated \
                            with this school will be modified",
        )
        parser.add_argument(
            "--dry-run",
            action=argparse.BooleanOptionalAction,
            help="dry run, but log what will be done",
        )

    def handle(self, *args, **options):
        try:
            logger.info(
                f"received a request to add {options['username']} to all \
                projects associated with school {options['school']}. \
                Value of dry run arg is {options['dry_run']}"
            )
            approver: User = User.objects.get(username=options["username"])
            school: School = School.objects.get(description=options["school"])
            dry_run: bool = options["dry_run"]
            manager_role: ProjectUserRoleChoice = ProjectUserRoleChoice.objects.get(name="manager")

            schools_for_approver = approver.userprofile.schools.all()
            if school not in schools_for_approver:
                logger.warn(f"User {approver} is not school approver for {school}")
                return

            projects_for_school = Project.objects.filter(school=school)
            for project in projects_for_school:
                approver_in_project: bool = False
                project_members = ProjectUser.objects.filter(project=project)
                for member in project_members:
                    if approver.username == member.user.username:
                        approver_in_project = True
                if not approver_in_project:
                    logger.info(f"approver {approver} not in project {project} and will be added")
                    if not dry_run:
                        approver_as_manager, status = ProjectUser.objects.get_or_create(
                            ProjectUser(user=approver, project=project, role=manager_role)
                        )
                        logger.info(f"Status of adding approver {approver} to project {project} is {status}")

        except Exception:
            logger.warning("Exception occurred with traceback:", exc_info=True)
