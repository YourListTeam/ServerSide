#!/bin/bash
echo "creating public and private key files";
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Create the public and private key files from the environment variables.
echo "${PUBLIC_KEY}" > ~/.ssh/id_rsa.pub
chmod 644 ~/.ssh/id_rsa.pub

# Note use of double quotes, required to preserve newlines
echo "${PRIVATE_KEY}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

export PUBLIC_KEY="";
export PRIVATE_KEY="";

# Preload the known_hosts file  (see "version 2" below)
echo '|1|CKLNmnXUo20IblyvVtK5eqfxkhE=|S+SYmJgNXZiqCIJWGAnPKyb8bJA= ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBOqyHh/myL33e9GtA45bPkjaUEoO3nRqqsMgYaRB3ihuvAkiSQLZCMp5BbE8Dq4abL3XhfsdM21YDWxrHHS02Ow=
|1|fymPIWUfoi/iq9PZP8jCC30IWGg=|Tjs/hHryX7xHP4rFcneRMf4CyeE= ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBOqyHh/myL33e9GtA45bPkjaUEoO3nRqqsMgYaRB3ihuvAkiSQLZCMp5BbE8Dq4abL3XhfsdM21YDWxrHHS02Ow=' > ~/.ssh/known_hosts

echo "Host *
    ServerAliveInterval 120" > ~/.ssh/config


# Start the SSH tunnel if not already running

PID=`pgrep -f "ssh -f -i"`
if [ $PID ] ; then
    echo "tunnel already running on ${PID}";
else
    echo "launching tunnel";
    ssh -f -i ~/.ssh/id_rsa -N -L 5433:mcsdb.utm.utoronto.ca:5432 $UTORID@dh2026pc00.utm.utoronto.ca;
fi

node app.js;