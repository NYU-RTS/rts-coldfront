from xdmod_data.warehouse import DataWarehouse
from coldfront.core.utils.common import import_from_settings
from multiprocessing import Process, Queue
import logging

XDMOD_API_URL = import_from_settings("XDMOD_API_URL", "https://localhost")

logger = logging.getLogger(__name__)

class XDMoDConnectivityError(Exception):
    pass

class XDMoDFetchError(Exception):
    pass

def _worker(q: Queue, url: str, metric: str, account: str) -> None:
    try:
        # Construct inside the worker so we don't share sockets across processes
        dw = DataWarehouse(url)
        with dw:
            data = dw.get_data(
                duration="90day",
                realm="Jobs",
                metric=metric,
                filters={"pi": account},
            )
        q.put(("ok", data))
    except Exception as e:
        # Send back a lightweight, picklable error payload
        q.put(("err", (e.__class__.__name__, str(e))))

def fetch_xdmod_with_timeout(url: str, metric: str, account: str, timeout_s: float = 15.0):
    q: Queue = Queue()
    p = Process(target=_worker, args=(q, url, metric, account))
    p.daemon = True
    p.start()
    p.join(timeout_s)

    if p.is_alive():
        p.terminate()  # hard-stop the stuck HTTP
        p.join(1)
        raise XDMoDConnectivityError(f"XDMoD get_data exceeded {timeout_s}s")

    if q.empty():
        # Worker died without sending anything
        raise XDMoDFetchError("XDMoD worker ended without a result")

    kind, payload = q.get()
    if kind == "ok":
        return payload
    else:
        exc_name, exc_msg = payload
        # Map timeouts to connectivity; everything else to fetch error
        if "Timeout" in exc_name or "timed out" in exc_msg.lower():
            raise XDMoDConnectivityError(f"XDMoD get_data timeout: {exc_msg}")
        raise XDMoDFetchError(f"XDMoD get_data error: {exc_name}: {exc_msg}")

def check_connectivity(url: str, timeout: float = 5.0) -> None:
    from urllib.parse import urlparse
    import requests

    p = urlparse(url)
    if p.scheme not in {"http", "https"} or not p.netloc:
        raise requests.exceptions.InvalidURL(f"Invalid URL: {url}")

    s = requests.Session()
    s.headers.update({"User-Agent": "xdmod-connectivity-check/1.0"})

    try:
        r = s.head(url, timeout=timeout, allow_redirects=True)
        r.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise XDMoDConnectivityError(str(e)) from e

def get_usage_data(_metric: str, _slurm_acccount_name: str):
    logger.info(
        f"attempting to fetch usage \
                associated with {_slurm_acccount_name}"
    )
    try:
        check_connectivity(XDMOD_API_URL)
        dw = DataWarehouse(XDMOD_API_URL)
        with dw:
            data = fetch_xdmod_with_timeout(
                XDMOD_API_URL,
                metric=_metric,
                account=_slurm_acccount_name,
                timeout_s=15.0
            )
            return data
    except XDMoDConnectivityError as e:
        logger.error("XDMOD connectivity error: %s", e)
        raise XDMoDConnectivityError(str(e)) from e
    except Exception as e:
        logger.exception("Unexpected error during XDMoD fetch")
        raise XDMoDFetchError(str(e)) from e
