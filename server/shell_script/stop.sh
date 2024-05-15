#!/bin/bash

path="/home/ubuntu/server/dist/app.js"
pid=$(pgrep -f $path)

if [ -n $pid ]
then
  sudo pm2 stop $path
  echo "stopped pm2"
else
  echo "skipped to stop pm2"
fi