import argparse
import logging

from django.core.management.base import BaseCommand

from coldfront.core.grant.models import Grant
from coldfront.core.project.models import Project
from coldfront.core.publication.models import Publication
from coldfront.core.user.models import UserProfile
from coldfront.core.utils.common import import_from_settings
from coldfront.core.utils.mail import send_email_template

logger = logging.getLogger(__name__)


EMAIL_SIGNATURE = import_from_settings("EMAIL_SIGNATURE")
EMAIL_SENDER = import_from_settings("EMAIL_SENDER")
CENTER_BASE_URL = import_from_settings("CENTER_BASE_URL")


class Command(BaseCommand):
    help = "Send emails to PIs with projects that have no grants/publications associated with them"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action=argparse.BooleanOptionalAction,
            default=False,
            help="dry run, log email content and recipients without sending the emails",
        )

    def handle(self, *args, **options):
        dry_run: bool = options["dry_run"]
        for pi_profile in UserProfile.objects.filter(is_pi=True):
            try:
                logger.info(f"processing projects for PI: {pi_profile.user.username}")
                projects_for_pi = Project.objects.filter(pi=pi_profile.user, status__name__in=["Active", "New"])
                projects_without_grants = {}
                projects_without_publications = {}

                for project in projects_for_pi:
                    logger.info(f"processing project: {project}")
                    if Grant.objects.filter(project=project).count() == 0:
                        projects_without_grants[project.title] = f"{CENTER_BASE_URL.strip('/')}/project/{project.pk}/"

                    if Publication.objects.filter(project=project).count() == 0:
                        projects_without_publications[project.title] = (
                            f"{CENTER_BASE_URL.strip('/')}/project/{project.pk}/"
                        )

                grant_notification_context = {
                    "pi_first_name": pi_profile.user.first_name,
                    "project_dict": projects_without_grants,
                    "signature": EMAIL_SIGNATURE,
                }
                logger.info(f"grant nudge context: {grant_notification_context}")
                if projects_without_grants and not dry_run:
                    logger.info(f"sending grant nudge to {pi_profile.user.username}")
                    send_email_template(
                        "Please update grant info for HPC project",
                        "email/request_to_add_grants.txt",
                        grant_notification_context,
                        EMAIL_SENDER,
                        [pi_profile.user.email],
                    )

                publication_notification_context = {
                    "pi_first_name": pi_profile.user.first_name,
                    "project_dict": projects_without_publications,
                    "signature": EMAIL_SIGNATURE,
                }
                logger.info(f"publication nudge context: {publication_notification_context}")
                if projects_without_publications and not dry_run:
                    logger.info(f"sending publication nudge to {pi_profile.user.username}")
                    send_email_template(
                        "Please update publication info for HPC projects",
                        "email/request_to_add_publications.txt",
                        publication_notification_context,
                        EMAIL_SENDER,
                        [pi_profile.user.email],
                    )
            except Exception:
                logger.exception("Exception occurred with traceback:", exc_info=True)
