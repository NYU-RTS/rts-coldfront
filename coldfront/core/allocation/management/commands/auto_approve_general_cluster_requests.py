import logging
import datetime

from django.core.management.base import BaseCommand

from coldfront.core.allocation.models import Allocation, AllocationStatusChoice
from coldfront.core.allocation.signals import (
    allocation_activate,
    allocation_activate_user,
)
from coldfront.core.utils.common import import_from_settings
from coldfront.core.utils.mail import (
    send_allocation_customer_email,
)

logger = logging.getLogger(__name__)

GENERAL_RESOURCE_NAME = import_from_settings("GENERAL_RESOURCE_NAME")
CENTER_BASE_URL = import_from_settings("CENTER_BASE_URL")


class Command(BaseCommand):
    help = "Apporve any allocation requests to access the base cluster \
    resource with a fixed end date"

    def handle(self, *args, **options):
        try:
            allocations = Allocation.objects.filter(resources__name=GENERAL_RESOURCE_NAME, status__name="New")
            active = AllocationStatusChoice.objects.get(name="Active")

            for allocation_obj in allocations:
                logger.info(f"Approving allocation number {allocation_obj.pk}")
                allocation_obj.status = active
                if not allocation_obj.start_date:
                    allocation_obj.start_date = datetime.datetime.now()
                allocation_obj.end_date = datetime.datetime(2035, 6, 1)
                allocation_obj.save()

                # We don't use signals now, but keeping this here
                # for consistency. Future plugins may use these signals
                allocation_activate.send(sender=None, allocation_pk=allocation_obj.pk)
                allocation_users = allocation_obj.allocationuser_set.exclude(
                    status__name__in=["Removed", "Error", "DeclinedEULA", "PendingEULA"]
                )
                for allocation_user in allocation_users:
                    allocation_activate_user.send(sender=None, allocation_user_pk=allocation_user.pk)

                send_allocation_customer_email(
                    allocation_obj,
                    "Allocation Activated",
                    "email/allocation_activated.txt",
                    domain_url=CENTER_BASE_URL,
                )
                logger.info(f"Approved allocation request: {allocation_obj.pk}")
        except Exception:
            logger.debug("Exception occured with traceback:", exc_info=True)
