#!/bin/bash

#Module installation
npm install

#Redis install
curl -O http://redis.googlecode.com/files/redis-2.6.0-rc7.tar.gz
tar xzf redis-2.6.0-rc7.tar.gz
pushd redis-2.6.0-rc7
make
make install
popd
rm ./redis-2.6.0-rc7.tar.gz
rm -r ./redis-2.6.0-rc7

echo "Bootstrap finished. Be sure to start redis via running the command \"redis-server\", then run bin/cms-server"