FROM registry.cloud.rt.nyu.edu/nyu-rts/ubi/ubi9

LABEL name="coldfront" \
      vendor="NYU RTS" \
      description="For production use to deploy Coldfront in RTC" 

# Build Python as superuser!
RUN dnf install -y python3.12 && dnf update -y

COPY . /app

RUN chown -R 1001:0 /app && \
    chmod -R g+rwx /app

USER 1001

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy


COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

RUN mkdir -p /tmp/uv
# Need this to prevent os13 errors on shipwright.
ENV UV_CACHE_DIR=/tmp/uv

RUN uv sync --locked --extra prod --no-dev

# Default port for gunicorn
EXPOSE 8000

# Remove when we get users, but keep it for testing for now
ENV DEBUG=True
ENV PYTHONUNBUFFERED=1
EXPOSE 5678

RUN chown -R 1001:0 /tmp/uv && \
    chmod -R g=u /tmp/uv

# Terrible hack for now :( )
USER 0
RUN chown -R 1001:0 /app && \
    chmod -R g+rwx /app
USER 1001
