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
from slurm_rest_api_client.models.v0043_assoc_max_jobs import V0043AssocMaxJobs
from slurm_rest_api_client.models.v0043_kill_jobs_msg import V0043KillJobsMsg
from slurm_rest_api_client.models.v0043_kill_jobs_resp_job import V0043KillJobsRespJob
from slurm_rest_api_client.models.v0043_openapi_assocs_resp import V0043OpenapiAssocsResp
from slurm_rest_api_client.models.v0043_uint_32_no_val_struct import V0043Uint32NoValStruct
from tenacity import (
    before_sleep_log,
    retry,
    retry_if_not_exception_type,
    stop_after_attempt,
    wait_exponential,
)

logger = logging.getLogger(__name__)


def log_request(request):
    logger.debug(f"Request event hook: {request.method} {request.url} - Waiting for response")


def log_response(response):
    request = response.request
    logger.debug(f"Response event hook: {request.method} {request.url} - Status {response.status_code}")


class SlurmCluster:
    def __init__(self, endpoint, token):
        self.endpoint = endpoint
        self.token = token
        # for most operations, re-use the root client
        self.root_client: Client = Client(
            base_url=self.endpoint,
            headers={
                "X-SLURM-USER-NAME": "root",
                "X-SLURM-USER-TOKEN": self.token,
            },
            httpx_args={"event_hooks": {"request": [log_request], "response": [log_response]}},
        )

    def __exit__(self):
        self.root_client.get_httpx_client().close()

    @retry(
        wait=wait_exponential(multiplier=2, min=2, max=10),
        stop=stop_after_attempt(10),
        retry=retry_if_not_exception_type(ConnectionError),
        before_sleep=before_sleep_log(logging.getLogger(__name__), logging.WARNING),
        retry_error_callback=lambda _: sys.exit(1),  # exit if SLURM cannot be reached :(
    )
    def get_accounts(self) -> list[V0043Account]:
        resp = slurmdb_v0043_get_accounts.sync(client=self.root_client, with_associations=str("true"))
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
    def delete_association_user_account(self, username: str, account: str, noop: bool = False) -> None:
        if noop:
            logging.info(f"noop enabled: skip deleting association between user: {username} and acconut: {account}")
            return

        # for some operations, instantiate a user client when possible
        # note that this needs the X-SLURM-USER-NAME header upon instantiation
        this_user_client: Client = Client(
            base_url=self.endpoint,
            headers={
                "X-SLURM-USER-NAME": f"{username}",
                "X-SLURM-USER-TOKEN": self.token,
            },
            httpx_args={"event_hooks": {"request": [log_request], "response": [log_response]}},
        )

        with this_user_client as client:
            # start by deleting active jobs for this user
            body_job_kill: V0043KillJobsMsg = V0043KillJobsMsg(user_name=username, account=account)
            jobs_delete_resp = slurm_v0043_delete_jobs.sync(client=client, body=body_job_kill)
            if jobs_delete_resp:
                deletion_statuses: list[V0043KillJobsRespJob] = jobs_delete_resp.status
                for status in deletion_statuses:
                    logging.debug(f"deletion status: {status}")
                if jobs_delete_resp.errors:
                    for error in jobs_delete_resp.errors:
                        logging.warning(f"error deleting job: {error}")
                    raise RuntimeError(f"Could not delete jobs for user: {username} with account: {account}")
            else:
                raise ConnectionError(f"Could not delete jobs for user: {username} with account: {account}")

        # set maxsubmit to 0 as root

        max_submit_assoc: V0043Assoc = V0043Assoc(
            user=username,
            account=account,
            max_=V0043AssocMax(V0043AssocMaxJobs(total=V0043Uint32NoValStruct(number=0))),
        )
        body_max_submit: V0043OpenapiAssocsResp = V0043OpenapiAssocsResp(associations=[max_submit_assoc])
        maxsubmit_set_resp = slurmdb_v0043_post_associations.sync(client=self.root_client, body=body_max_submit)
        if maxsubmit_set_resp:
            logger.info("resp")
        return
