#!/usr/bin/env bash

apt-get install -y python-software-properties
add-apt-repository -y ppa:rwky/redis
apt-get update
apt-get install -y redis-server