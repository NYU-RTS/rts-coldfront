import logging

from django.core.management.base import BaseCommand
from coldfront.core.resource.models import (
    ResourceAttribute,
    ResourceAttributeType,
    Resource,
)
from coldfront.plugins.slurm.utils import SLURM_CLUSTER_ATTRIBUTE_NAME
from coldfront.core.utils.common import import_from_settings

GENERAL_RESOURCE_NAME = import_from_settings("GENERAL_RESOURCE_NAME")

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Create ResourceAttribute for default SLURM cluster resousce"

    def handle(self, *args, **options):
        logger.setLevel(logging.INFO)

        clusters = Resource.objects.filter(resource_type__name="Cluster")
        if clusters.count() != 1:
            logger.warning(
                "More than one cluster is present, \
                           will not set ResourceAttribute"
            )
            return

        cluster = clusters[0]
        if cluster.name != GENERAL_RESOURCE_NAME:
            logger.warning(
                f"Cluster is present, but it is {cluster.name},\
                           differernt from {GENERAL_RESOURCE_NAME} \
                           will not set ResourceAttribute"
            )
            return

        _, created = ResourceAttribute.objects.get_or_create(
            resource_attribute_type=ResourceAttributeType.objects.filter(
                name=SLURM_CLUSTER_ATTRIBUTE_NAME
            )[0],
            resource=cluster,
            value=GENERAL_RESOURCE_NAME,
        )

        if created:
            logger.info(
                f"Resource Attribute for {GENERAL_RESOURCE_NAME} \
                        HPC cluster resource added."
            )
        else:
            logger.info(
                f"ResourceAttribute for {GENERAL_RESOURCE_NAME}\
                 HPC cluster resource already available in DB."
            )

        return
