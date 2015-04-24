#!/bin/bash

cd client
gulp build
cd ..
docker build -t $1 . && docker push $1