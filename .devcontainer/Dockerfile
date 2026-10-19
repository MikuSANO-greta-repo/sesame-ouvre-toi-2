FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

USER root

# Installing zstd, which Ollama-Feature requires 
RUN apt-get update \
    && apt-get install -y --no-install-recommends zstd \
    && rm -rf /var/lib/apt/lists/*

# Change file owner to mount it as volume
RUN mkdir -p /home/node/.ollama \
    && chown -R node:node /home/node/.ollama

WORKDIR /workspace

USER node
