#!/bin/bash
source config.env;
proc=`pgrep -f 'ssh -f -N'`;
if [ $? == 0 ]; then
    kill $proc;
fi
npm i;
ssh -f -N -L 5433:mcsdb.utm.utoronto.ca:5432 azarskyy@cslinux.utm.utoronto.ca;
npx nodemon app.js;