from coldfront.config.base import INSTALLED_APPS

INSTALLED_APPS += [
    "django_filters",
    "rest_framework",
    "rest_framework.authtoken",
    "coldfront.plugins.api",
    "drf_spectacular",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        # only use BasicAuthentication for test purposes
        # 'rest_framework.authentication.BasicAuthentication',
    ),
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "RTS Coldfront API",
    "DESCRIPTION": "HPC Project Management portal",
    "VERSION": "2025.12.02",
    "SERVE_INCLUDE_SCHEMA": False,
}
