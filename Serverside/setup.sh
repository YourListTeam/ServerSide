#!/bin/bash
echo $PRIVATE_KEY > id_rsa;
echo $PUBLIC_KEY > id_rsa.pub;
ssh -i id_rsa -f -N -L 5433:mcsdb.utm.utoronto.ca:5432 @cslinux.utm.utoronto.ca;
node app.js;