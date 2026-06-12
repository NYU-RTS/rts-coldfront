# SPDX-FileCopyrightText: (C) ColdFront Authors
#
# SPDX-License-Identifier: AGPL-3.0-or-later

import logging
import sys

from django.core.management.base import BaseCommand

from coldfront.core.resource.models import Resource, ResourceAttribute
from coldfront.core.allocation.models import Allocation
from coldfront.core.utils.common import import_from_settings

from coldfront_plugin_slurmrest.utils import SlurmCluster

from slurm_rest_api_client.models.v0043_account import V0043Account
from slurm_rest_api_client.types import Unset

SLURMREST_CLUSTER_ATTRIBUTE_NAME = import_from_settings(
    "SLURMREST_CLUSTER_ATTRIBUTE_NAME", []
)
SLURM_IGNORE_USERS = import_from_settings("SLURM_IGNORE_USERS", [])
SLURM_IGNORE_ACCOUNTS = import_from_settings("SLURM_IGNORE_ACCOUNTS", [])
SLURM_IGNORE_CLUSTERS = import_from_settings("SLURM_IGNORE_CLUSTERS", [])
SLURM_NOOP = import_from_settings("SLURM_NOOP", False)

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Check consistency one Slurm Cluster and ColdFront allocations. Optionally remove associations in Slurm that no longer exist in ColdFront."

    def add_arguments(self, parser):
        parser.add_argument(
            "-s",
            "--sync",
            help="Remove associations in Slurm that no longer exist in ColdFront",
            action="store_true",
        )
        parser.add_argument(
            "-n",
            "--noop",
            help="Print commands only. Do not run any commands.",
            action="store_true",
        )
        parser.add_argument(
            "-c", "--cluster", help="SLURM cluster name cluster", default=None
        )
        parser.add_argument(
            "-e", "--endpoint", help="SLURM REST API Endpoint", default=None
        )
        parser.add_argument(
            "-t",
            "--token",
            help="SLURM REST API Token for authentication",
            default=None,
        )
        parser.add_argument("-a", "--account", help="Check specific account")
        parser.add_argument("-u", "--username", help="Check specific username")

    def _skip_user(self, username, account_name):
        if username in SLURM_IGNORE_USERS:
            logger.debug(f"Ignoring user: {username}")
            return True

        if account_name in SLURM_IGNORE_ACCOUNTS:
            logger.debug(f"Ignoring account: {account_name}")
            return True

        if self.filter_account and account_name != self.filter_account:
            return True

        if self.filter_user and username != self.filter_user:
            return True

        return False

    def _skip_account(self, account_name):
        if account_name in SLURM_IGNORE_ACCOUNTS:
            logger.debug(f"Ignoring account: {account_name}")
            return True

        if self.filter_user:
            return True

        if self.filter_account and account_name != self.filter_account:
            return True

        return False

    def check_consistency(self, slurm_cluster, coldfront_resource):
        """Check for accounts in Slurm NOT in ColdFront"""
        allocation_dict: dict[str, Allocation] = {}
        # set of all (stakeholder) resources that can have allocations
        resources: set[Resource] = {
            resource for resource in coldfront_resource.resource_set.all()
        }
        # also add parent cluster resource!
        resources.add(coldfront_resource)

        for resource in resources:
            allocations = resource.allocation_set.filter(status__name="Active")
            for allocation in allocations:
                slurm_acconut_name = allocation.allocationattribute_set.get(
                    allocation_attribute_type__name="slurm_account_name"
                ).value
                allocation_dict[slurm_acconut_name] = allocation

        cluster_accounts: list[V0043Account] = slurm_cluster.get_accounts()

        for account in cluster_accounts:
            if account.name == "root" or self._skip_account(account.name):
                logger.debug("Ignoring account %s", account["name"])
                continue

            if isinstance(account.associations, Unset):
                # account has no associations!
                logger.warning(f"SLURM acconut {account.name} has no associations!")
                continue

            if account.name in allocation_dict:
                logger.debug("Slurm account %s found in ColdFront", account.name)
                allocation_users = allocation_dict[
                    account.name
                ].allocationuser_set.filter(status__name="Active")

                for association in account.associations:
                    # Only SLURM devs know whey some associations are two way (account, cluster)
                    # when most others are 4-way (user, account, cluster, partition)
                    if not association["user"]:
                        continue

                    username = association["user"]
                    if username == "root" or self._skip_user(username, account.name):
                        logger.debug(
                            "Ignoring user %s in account %s", username, account.name
                        )
                        continue
                    if username in [au.user.username for au in allocation_users]:
                        logger.debug(
                            "Slurm user %s in account %s found in ColdFront",
                            username,
                            account.name,
                        )
                    else:
                        logger.warning(
                            "Slurm user %s has no association with account %s in ColdFront, removing association",
                            account.name,
                            username,
                        )
            else:
                for association in account.associations:
                    # Only SLURM devs know whey some associations are two way (account, cluster)
                    # when most others are 4-way (user, account, cluster, partition)
                    if not association["user"]:
                        continue

                    username = association["user"]
                    if username == "root" or self._skip_user(username, account.name):
                        logger.debug(
                            "Ignoring user %s in account %s", username, account.name
                        )
                        continue

                    logger.warning(
                        "Slurm account %s with user %s not found in ColdFront. Removing association.",
                        account.name,
                        username,
                    )

    def handle(self, *args, **options):

        verbosity = int(options["verbosity"])
        root_logger = logging.getLogger("")
        if verbosity == 0:
            root_logger.setLevel(logging.ERROR)
        elif verbosity == 3:
            root_logger.setLevel(logging.DEBUG)
        elif verbosity == 1:
            root_logger.setLevel(logging.INFO)
        # verbosity 2: leave root logger level as configured by Django logging

        self.sync = False
        if options["sync"]:
            self.sync = True
            logger.warning("Syncing Slurm with ColdFront")

        self.noop = SLURM_NOOP
        if options["noop"]:
            self.noop = True
            logger.warning("NOOP enabled")

        if not options["cluster"]:
            logger.error("Please provide at least one cluster name!")
            sys.exit(1)
        if (not options["endpoint"]) or (not options["token"]):
            logger.error("Please provide the SLURM REST API endpoint and token")
            sys.exit(1)
        cluster_name = options["cluster"]

        self.filter_user = options["username"]
        self.filter_account = options["account"]

        logger.info(f"Checking Slurm cluster: {cluster_name}")
        slurm_cluster = SlurmCluster(
            endpoint=options["endpoint"], token=options["token"]
        )

        if cluster_name in SLURM_IGNORE_CLUSTERS:
            logger.warning("Ignoring cluster %s. Nothing to do.", cluster_name)
            sys.exit(0)

        try:
            coldfront_resource = ResourceAttribute.objects.get(
                resource_attribute_type__name=SLURMREST_CLUSTER_ATTRIBUTE_NAME,
                value=cluster_name,
            ).resource
        except ResourceAttribute.DoesNotExist:
            logger.error(
                "No Slurm '%s' cluster resource found in ColdFront using '%s' attribute",
                cluster_name,
                SLURMREST_CLUSTER_ATTRIBUTE_NAME,
            )

        self.check_consistency(slurm_cluster, coldfront_resource)
