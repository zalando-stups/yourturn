#!/bin/bash

if [ -z "$DEFAULT_DOCKER_REGISTRY" ]
then
    echo "WARN: No default docker registry set."
fi

if [ -z "$1" ]
then
    echo "No version supplied, aborting."
    exit 1
fi

# build
npm install
cd client
gulp build
cd ..
# push
docker build -t "$DEFAULT_DOCKER_REGISTRY/stups/yourturn:$1" . && docker push "$DEFAULT_DOCKER_REGISTRY/stups/yourturn:$1"