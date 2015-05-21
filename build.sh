#!/bin/bash

npm install
cd client
gulp build
cd ..
pierone login
docker build -t $1 . && docker push $1