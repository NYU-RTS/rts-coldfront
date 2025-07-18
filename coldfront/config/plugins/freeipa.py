from coldfront.config.base import INSTALLED_APPS, ENV
from coldfront.config.env import ENV

INSTALLED_APPS += [
    "coldfront.plugins.freeipa",
]

FREEIPA_KTNAME = ENV.str("FREEIPA_KTNAME")
FREEIPA_SERVER = ENV.str("FREEIPA_SERVER")
FREEIPA_USER_SEARCH_BASE = ENV.str("FREEIPA_USER_SEARCH_BASE")
FREEIPA_ENABLE_SIGNALS = False
ADDITIONAL_USER_SEARCH_CLASSES = [
    "coldfront.plugins.freeipa.search.LDAPUserSearch",
]
