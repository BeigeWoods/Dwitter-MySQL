#!/bin/bash

PATH="/home/ubuntu/server/dist/app.js"
CURRENT_PID=$(pgrep -f $PATH)

if [ -z $CURRENT_PID ]; then
  sudo pm2 stop $PATH
  echo "stopped pm2"
else
  echo "skipped to stop pm2"
fi