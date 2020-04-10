#!/bin/bash
source config.env
npm i
nohup npx nodemon app.js&
