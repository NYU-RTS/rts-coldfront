import datetime

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone
from django_q.tasks import schedule

base_dir = settings.BASE_DIR


class Command(BaseCommand):
    def handle(self, *args, **options):
        date = timezone.now() + datetime.timedelta(days=1)
        date = date.replace(hour=0, minute=0, second=0, microsecond=0)
        schedule(
            "coldfront.core.allocation.tasks.update_statuses",
            schedule_type="D",
            next_run=date,
        )

        schedule(
            "coldfront.core.allocation.tasks.send_expiry_emails",
            schedule_type="D",
            next_run=date,
        )
