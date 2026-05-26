import logging
import sys

from coldfront.config.base import INSTALLED_APPS
from coldfront.config.env import ENV  # noqa: F401

logger = logging.getLogger(__name__)

if "coldfront_plugin_slurmrest" not in INSTALLED_APPS:
    INSTALLED_APPS += [
        "coldfront_plugin_slurmrest",
    ]

SLURMREST_CLUSTER_ATTRIBUTE_NAME = ENV.str("SLURM_CLUSTER_ATTRIBUTE_NAME", default="slurm_cluster")
SLURMREST_ACCOUNT_ATTRIBUTE_NAME = ENV.str("SLURM_ACCOUNT_ATTRIBUTE_NAME", default="slurm_account_name")
SLURMREST_SPECS_ATTRIBUTE_NAME = ENV.str("SLURM_SPECS_ATTRIBUTE_NAME", default="slurm_specs")
SLURMREST_USER_SPECS_ATTRIBUTE_NAME = ENV.str("SLURM_USER_SPECS_ATTRIBUTE_NAME", default="slurm_user_specs")

SLURMREST_NOOP = ENV.bool("SLURM_NOOP", default=False)
SLURMREST_IGNORE_USERS = ENV.list("SLURM_IGNORE_USERS", default=["root"])
SLURMREST_IGNORE_ACCOUNTS = ENV.list("SLURM_IGNORE_ACCOUNTS", default=[])

SLURMREST_CLUSTERS = {}
for cluster in filter(None, ENV.str("SLURMREST_CLUSTERS", "").split(",")):
    cluster_name = f"SLURM_{cluster.upper()}"
    endpoint = ENV.str(f"{cluster_name}_ENDPOINT", default=None)
    token = ENV.str(f"{cluster_name}_TOKEN", default=None)
    if endpoint is None or token is None:
        # this is an informational logging entry, but since this occurs
        # before the log handlers are configured, it needs to be at the
        # warn level for the output to be visible in the build logs
        logger.warn(
            "Configuring slurmrest cluster %r: %s and %s missing, adding dummy values",
            cluster,
            f"{cluster_name}_ENDPOINT",
            f"{cluster_name}_TOKEN",
        )
        endpoint = "dummy"
        token = "dummy"

    SLURMREST_CLUSTERS[cluster] = {
        "name": cluster,
        "base_url": endpoint,
        "token": token,
    }
