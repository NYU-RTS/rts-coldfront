########################
# 1) Frontend build stage
########################
FROM registry.access.redhat.com/hi/nodejs:latest-builder AS frontend
WORKDIR /app

USER root

# Copy only npm manifests first for caching
COPY coldfront/static/package.json coldfront/static/package-lock.json ./coldfront/static/
WORKDIR /app/coldfront/static
RUN npm ci

# Copy the rest of the frontend sources
COPY coldfront/static ./

# Build (should output bundles + manifest)
RUN npm run build

USER ${CONTAINER_DEFAULT_USER}

########################
# 2) Build Coldfront app
########################
FROM registry.access.redhat.com/hi/python:3.12-builder AS builder

USER root

RUN dnf install -y git && dnf update -y

COPY . /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

RUN mkdir -p /tmp/uv

# Need this to prevent os13 errors on shipwright.
ENV UV_CACHE_DIR=/tmp/uv

RUN uv sync --locked --extra prod

USER ${CONTAINER_DEFAULT_USER}

########################
# 3) Final stage
########################
FROM registry.access.redhat.com/hi/python:3.12
LABEL name="coldfront" \
      vendor="NYU RTS" \
      description="For production use to deploy Coldfront in RTC" 

# Copy built bundles/manifest from frontend stage into the backend image
COPY --from=frontend /app/coldfront/static/bundles /app/coldfront/static/bundles

# Copy the django app
COPY --from=builder /app /app

# Copy uv cache as it cannot be created in a shell-less container
COPY --chown=1001:0 --chmod=775 --from=builder /tmp/uv /tmp/uv

# Need this to prevent os13 errors on shipwright.
ENV UV_CACHE_DIR=/tmp/uv

# Need uv binary in the final image as well
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Default port for gunicorn
EXPOSE 8000

WORKDIR /app
