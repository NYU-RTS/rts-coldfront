# SPDX-FileCopyrightText: (C) ColdFront Authors
#
# SPDX-License-Identifier: AGPL-3.0-or-later

import sys
import logging

from tenacity import (
    retry,
    wait_exponential,
    stop_after_attempt,
    retry_if_not_exception_type,
    before_sleep_log,
)
from slurm_rest_api_client import Client
from slurm_rest_api_client.models.v0043_account import V0043Account
from slurm_rest_api_client.api.slurmdb import slurmdb_v0043_get_accounts


logger = logging.getLogger(__name__)


def log_request(request):
    logger.info(f"Request event hook: {request.method} {request.url} - Waiting for response")


def log_response(response):
    request = response.request
    logger.info(f"Response event hook: {request.method} {request.url} - Status {response.status_code}")


class SlurmCluster:
    def __init__(self, endpoint, token):
        self.root_client: Client = Client(
            base_url=endpoint,
            headers={
                "X-SLURM-USER-NAME": "root",
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
