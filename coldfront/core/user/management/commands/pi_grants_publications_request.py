import logging

from django.core.management.base import BaseCommand

from coldfront.core.grant.models import Grant
from coldfront.core.project.models import Project
from coldfront.core.publication.models import Publication
from coldfront.core.user.models import UserProfile
from coldfront.core.utils.common import import_from_settings
from coldfront.core.utils.mail import send_email_template

logger = logging.getLogger(__name__)

GENERAL_RESOURCE_NAME = import_from_settings("GENERAL_RESOURCE_NAME")
CENTER_BASE_URL = import_from_settings("CENTER_BASE_URL")
EMAIL_SIGNATURE = import_from_settings("EMAIL_SIGNATURE")
EMAIL_SENDER = import_from_settings("EMAIL_SENDER")


class Command(BaseCommand):
    help = "Send emails to PIs with projects that have no grants/publications associated with them"

    def handle(self, *args, **options):
        try:
            for pi_profile in UserProfile.objects.filter(is_pi=True):
                logger.info(f"processing projects for PI: {pi_profile.user.username}")
                projects_for_pi = Project.objects.filter(pi=pi_profile.user)
                for project in projects_for_pi:
                    logger.info(f"processing project: {project}")
                    if Grant.objects.filter(project=project).count() == 0:
                        grant_notification_context = {
                            "pi_first_name": pi_profile.user.first_name,
                            "project": project.title,
                            "signature": EMAIL_SIGNATURE,
                        }
                        logger.info(f"sending grant nudge with context: {grant_notification_context}")
                        send_email_template(
                            f"Please update grant info for HPC project {project.title}",
                            "email/request_to_add_grants.txt",
                            grant_notification_context,
                            EMAIL_SENDER,
                            pi_profile.user.email,
                        )

                    if Publication.objects.filter(project=project).count() == 0:
                        publication_notification_context = {
                            "pi_first_name": pi_profile.user.first_name,
                            "project": project.title,
                            "signature": EMAIL_SIGNATURE,
                        }
                        logger.info(f"sending publication nudge with context: {publication_notification_context}")
                        send_email_template(
                            f"Please update publications resulting from use of HPC project {project.title}",
                            "email/request_to_add_publications.txt",
                            publication_notification_context,
                            EMAIL_SENDER,
                            pi_profile.user.email,
                        )
        except Exception:
            logger.exception("Exception occured with traceback:", exc_info=True)
