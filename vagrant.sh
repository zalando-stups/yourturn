#!/usr/bin/env bash

mkdir /apps
apt-get update

apt-get install -y wget tcl
wget http://download.redis.io/releases/redis-3.0.5.tar.gz
tar xzf redis-3.0.5.tar.gz
cd redis-3.0.5
make
make test
cd ..
mv redis-3.0.5 /apps
chmod a+x -R /apps/redis-3.0.5
mv /apps/redis-3.0.5/redis.conf /apps/redis-3.0.5/redis.default.conf
echo "daemonize yes" >> /apps/redis-3.0.5/redis.conf
/apps/redis-3.0.5/src/redis-server /apps/redis-3.0.5/redis.conf
