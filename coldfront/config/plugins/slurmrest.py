from coldfront.config.base import INSTALLED_APPS
from coldfront.config.env import ENV  # noqa: F401


INSTALLED_APPS += [
    "coldfront.plugins.slurmrest",
]

SLURMREST_CLUSTER_ATTRIBUTE_NAME = ENV.str("SLURM_CLUSTER_ATTRIBUTE_NAME", default="slurm_cluster")
SLURMREST_ACCOUNT_ATTRIBUTE_NAME = ENV.str("SLURM_ACCOUNT_ATTRIBUTE_NAME", default="slurm_account_name")
SLURMREST_SPECS_ATTRIBUTE_NAME = ENV.str("SLURM_SPECS_ATTRIBUTE_NAME", default="slurm_specs")
SLURMREST_USER_SPECS_ATTRIBUTE_NAME = ENV.str("SLURM_USER_SPECS_ATTRIBUTE_NAME", default="slurm_user_specs")

SLURMREST_NOOP = ENV.bool("SLURM_NOOP", default=False)
SLURMREST_IGNORE_USERS = ENV.list("SLURM_IGNORE_USERS", default=["root"])
SLURMREST_IGNORE_ACCOUNTS = ENV.list("SLURM_IGNORE_ACCOUNTS", default=["root", "users"])
