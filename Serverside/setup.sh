#!/bin/bash
echo $PRIVATE_KEY > ~/.ssh/id_rsa;
echo $PUBLIC_KEY > ~/.ssh/id_rsa.pub;
ssh -f -N -L 5433:mcsdb.utm.utoronto.ca:5432 @cslinux.utm.utoronto.ca;
node app.js;