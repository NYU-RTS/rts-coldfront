# SPDX-FileCopyrightText: (C) ColdFront Authors
#
# SPDX-License-Identifier: AGPL-3.0-or-later

import logging
import sys

from slurm_rest_api_client import Client
from slurm_rest_api_client.api.slurm import slurm_v0043_delete_jobs
from slurm_rest_api_client.api.slurmdb import slurmdb_v0043_get_accounts, slurmdb_v0043_post_associations
from slurm_rest_api_client.models.v0043_account import V0043Account
from slurm_rest_api_client.models.v0043_assoc import V0043Assoc
from slurm_rest_api_client.models.v0043_assoc_max import V0043AssocMax
from slurm_rest_api_client.models.v0043_kill_jobs_resp import V0043KillJobsRespJob
from slurm_rest_api_client.types import UNSET
from tenacity import (
    before_sleep_log,
    retry,
    retry_if_not_exception_type,
    stop_after_attempt,
    wait_exponential,
)

logger = logging.getLogger(__name__)


def log_request(request):
    logger.info(f"Request event hook: {request.method} {request.url} - Waiting for response")


def log_response(response):
    request = response.request
    logger.info(f"Response event hook: {request.method} {request.url} - Status {response.status_code}")


class SlurmCluster:
    def __init__(self, endpoint, token):
        # for most operations, re-use the root client
        self.root_client: Client = Client(
            base_url=endpoint,
            headers={
                "X-SLURM-USER-NAME": "root",
                "X-SLURM-USER-TOKEN": token,
            },
            httpx_args={"event_hooks": {"request": [log_request], "response": [log_response]}},
        )

        # for some operations, instantiate a user client when possible
        # note that this needs the X-SLURM-USER-NAME header upon instantiation
        self.user_client: Client = Client(
            base_url=endpoint,
            headers={
                "X-SLURM-USER-TOKEN": token,
            },
            httpx_args={"event_hooks": {"request": [log_request], "response": [log_response]}},
        )

    @retry(
        wait=wait_exponential(multiplier=2, min=2, max=10),
        stop=stop_after_attempt(10),
        retry=retry_if_not_exception_type(ConnectionError),
        before_sleep=before_sleep_log(logging.getLogger(__name__), logging.WARNING),
        retry_error_callback=lambda _: sys.exit(1),  # exit if SLURM cannot be reached :(
    )
    def get_accounts(self) -> list[V0043Account]:
        with self.root_client as client:
            resp = slurmdb_v0043_get_accounts.sync(client=client, with_associations=str("true"))
            if resp:
                return resp.accounts
            else:
                raise ConnectionError("Could not get list of accounts from SLURM endpoint")

    # retry the whole block atomically
    @retry(
        wait=wait_exponential(multiplier=2, min=2, max=10),
        stop=stop_after_attempt(3),
        retry=retry_if_not_exception_type(ConnectionError),
        before_sleep=before_sleep_log(logging.getLogger(__name__), logging.WARNING),
    )
    def delete_association_user_account(self, username: str, account: str) -> None:
        # start by deleting active jobs for this user
        with self.user_client(headers={"X-SLURM-USER-NAME": f"{username}"}) as this_user_client:
            jobs_delete_resp = slurm_v0043_delete_jobs.sync(
                client=this_user_client, user_name=username, account=account
            )
            if jobs_delete_resp:
                deletion_statuses: list[V0043KillJobsRespJob] = jobs_delete_resp.status
                for status in deletion_statuses:
                    logging.debug(f"deletion status: {status}")
                if not isinstance(jobs_delete_resp.error, UNSET):
                    for error in jobs_delete_resp.error:
                        logging.warning(f"error deleting job: {error}")
                    raise RuntimeError(f"Could not delete jobs for user: {username} with account: {account}")
            else:
                raise ConnectionError(f"Could not delete jobs for user: {username} with account: {account}")

        # set maxsubmit to 0
        with self.root_client() as client:
            max_submit_assoc: V0043Assoc = V0043Assoc(user=username, account=account, max_=V0043AssocMax(jobs=0))
            maxsubmit_set_resp = slurmdb_v0043_post_associations.sync(client=client, associations=[max_submit_assoc])
            if maxsubmit_set_resp:
                logger.info("resp")
            return
