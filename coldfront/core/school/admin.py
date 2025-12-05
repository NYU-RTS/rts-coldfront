from django.contrib import admin
from coldfront.core.school.models import School
from coldfront.core.user.models import ApproverProfile


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ("description", "get_approvers_list")
    search_fields = ["description"]

    def get_approvers_list(self, obj):
        """
        Retrieves a list of usernames who are approvers for this school.
        'obj' here is an instance of the School model.
        """
        # Find all ApproverProfile instances that have a many-to-many relationship with this school
        approvers = ApproverProfile.objects.filter(schools=obj)

        # Extract the username from the associated UserProfile
        usernames = [
            approver_profile.user_profile.user.username
            for approver_profile in approvers
        ]

        # Return a string with the usernames joined by a comma and a space
        return ", ".join(usernames)

    # Set a user-friendly column header
    get_approvers_list.short_description = "Approvers"
