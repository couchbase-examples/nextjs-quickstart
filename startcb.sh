#!/bin/bash

OS_USER_GROUP="${OS_USER_GROUP:=gitpod:gitpod}"

CB_USER="${CB_USER:-Administrator}"
CB_PSWD="${CB_PSWD:-password}"
CB_HOST="${CB_HOST:-127.0.0.1}"
CB_PORT="${CB_PORT:-8091}"
CB_NAME="${CB_NAME:-cbgitpod}"

CB_SERVICES="${CB_SERVICES:-data,query,index,fts,eventing,analytics}"

CB_KV_RAMSIZE="${CB_KV_RAMSIZE:-256}"
CB_INDEX_RAMSIZE="${CB_INDEX_RAMSIZE:-256}"
CB_FTS_RAMSIZE="${CB_FTS_RAMSIZE:-256}"
CB_EVENTING_RAMSIZE="${CB_EVENTING_RAMSIZE:-512}"
CB_ANALYTICS_RAMSIZE="${CB_ANALYTICS_RAMSIZE:-1024}"

set -euo pipefail

COUCHBASE_TOP=/opt/couchbase
sudo chown -R ${OS_USER_GROUP} ${COUCHBASE_TOP}/var

echo "Start couchbase..."
couchbase-server --start

echo "Waiting for couchbase-server..."
until curl -s http://${CB_HOST}:${CB_PORT}/pools > /dev/null; do
    sleep 5
    echo "Waiting for couchbase-server..."
done

echo "Waiting for couchbase-server... ready"

if ! couchbase-cli server-list -c ${CB_HOST}:${CB_PORT} -u ${CB_USER} -p ${CB_PSWD} > /dev/null; then
  echo "couchbase cluster-init..."
  couchbase-cli cluster-init \
        --services ${CB_SERVICES} \
        --cluster-name ${CB_NAME} \
        --cluster-username ${CB_USER} \
        --cluster-password ${CB_PSWD} \
        --cluster-ramsize ${CB_KV_RAMSIZE} \
        --cluster-index-ramsize ${CB_INDEX_RAMSIZE} \
        --cluster-fts-ramsize ${CB_FTS_RAMSIZE} \
        --cluster-eventing-ramsize ${CB_EVENTING_RAMSIZE} \
        --cluster-analytics-ramsize ${CB_ANALYTICS_RAMSIZE}
fi

sleep 3
