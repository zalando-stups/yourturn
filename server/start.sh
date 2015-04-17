#!/bin/bash

docker run -d -p 5000:8181 -v $PWD:/swagger zalando/swagger-mock ./server/mocks/kio.yaml
docker run -d -p 5001:8181 -v $PWD:/swagger zalando/swagger-mock ./server/mocks/twintip.yaml