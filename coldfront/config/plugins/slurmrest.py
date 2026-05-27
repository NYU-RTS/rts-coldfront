import logging

from coldfront.config.base import INSTALLED_APPS
from coldfront.config.env import ENV  # noqa: F401

logger = logging.getLogger(__name__)

if "coldfront_plugin_slurmrest" not in INSTALLED_APPS:
    INSTALLED_APPS += [
        "coldfront_plugin_slurmrest",
    ]

SLURMREST_CLUSTER_ATTRIBUTE_NAME = ENV.str("SLURM_CLUSTER_ATTRIBUTE_NAME", default="slurm_cluster")
SLURMREST_NOOP = ENV.bool("SLURM_NOOP", default=False)
SLURMREST_IGNORE_USERS = ENV.list("SLURM_IGNORE_USERS", default=["root"])
SLURMREST_IGNORE_ACCOUNTS = ENV.list("SLURM_IGNORE_ACCOUNTS", default=[])

SLURMREST_CLUSTERS = {}
for cluster in filter(None, ENV.str("SLURMREST_CLUSTERS", "").split(",")):
    cluster_name = f"SLURM_{cluster.upper()}"
    endpoint = ENV.str(f"{cluster_name}_ENDPOINT", default=None)
    user_token = ENV.str(f"{cluster_name}_USERTOKEN", default=None)
    user_name = ENV.str(f"{cluster_name}_USERNAME", default=None)
    if endpoint is None or user_name is None or user_token is None:
        # this is an informational logging entry, but since this occurs
        # before the log handlers are configured, it needs to be at the
        # warn level for the output to be visible
        logger.warn(
            f"Configuring slurmrest cluster {cluster}: one of {cluster_name}_ENDPOINT/USERNAME/USERTOKEN is missing adding dummy values"
        )
        endpoint = "dummy"
        user_token = "dummy"
        user_name = "dummy"

    SLURMREST_CLUSTERS[cluster] = {
        "cluster_name": cluster,
        "base_url": endpoint,
        "user_token": user_token,
        "user_name": user_name,
    }
