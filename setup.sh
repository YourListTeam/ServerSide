#!/bin/bash
echo "creating public and private key files";
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Create the public and private key files from the environment variables.
echo "${PUBLIC_KEY}" > ~/.ssh/id_rsa.pub
chmod 644 $~/.ssh/id_rsa.pub

# Note use of double quotes, required to preserve newlines
echo "${PRIVATE_KEY}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# Preload the known_hosts file  (see "version 2" below)

# Start the SSH tunnel if not already running

PID=`pgrep -f ssh`
if [ $PID ] ; then
    echo "tunnel already running on ${PID}";
else
    echo "launching tunnel";
    ssh -f -i ~/.ssh/id_rsa -N -L 5433:mcsdb.utm.utoronto.ca:5432 $UTORID@cslinux.utm.utoronto.ca;
fi

node app.js;