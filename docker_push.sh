#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t climatetree:backend-mongo .
docker tag climatetree:backend-mongo patelvp/climatetree:backend-mongo
docker push patelvp/climatetree