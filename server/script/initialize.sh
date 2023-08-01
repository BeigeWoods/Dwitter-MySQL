#!/bin/bash

PATH="/project/env/"
FILENAME=".env"

cd /home/ubuntu/server

if [ -f $FILENAME ]
then
   sudo rm -rf $FILENAME
   echo "$FILENAME is removed"
fi

sudo touch $FILENAME

sudo $(echo ALLOWED_ORIGIN=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"ALLOWED_ORIGIN" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo JWT_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"JWT_SECRET" --with-decryption --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo JWT_EXPIRES_SEC=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"JWT_EXPIRES_SEC" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo BCRYPT_SALT_ROUNDS=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"BCRYPT_SALT_ROUNDS" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo BCRYPT_RANDOM_WORDS=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"BCRYPT_RANDOM_WORDS" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo HOST_PORT=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"HOST_PORT" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo DB_HOST=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"DB_HOST" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo DB_USER=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"DB_USER" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo DB_DATABASE=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"DB_DATABASE" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo DB_PASSWORD=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"DB_PASSWORD" --with-decryption --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo CSRF_SECRET_KEY=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"CSRF_SECRET_KEY" --with-decryption --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo GH_CLIENT_ID=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"GH_CLIENT_ID" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo GH_CLIENT_SECRETS=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"GH_CLIENT_SECRETS" --with-decryption --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo AWS_S3_REGION=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"AWS_S3_REGION" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo AWS_S3_ID=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"AWS_S3_ID" --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)
sudo $(echo AWS_S3_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names $PATH"AWS_S3_SECRET" --with-decryption --query Parameters[0].Value | sed 's/"//g') >> $FILENAME)

sudo npm i