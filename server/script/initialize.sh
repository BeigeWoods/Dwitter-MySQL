#!/bin/bash

path="/project/env/"
filename=".env"

cd /home/ubuntu/server

touch $filename

echo ALLOWED_ORIGIN=$(aws ssm get-parameters --region ap-northeast-2 --names $path"ALLOWED_ORIGIN" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo JWT_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names $path"JWT_SECRET" --with-decryption --query Parameters[0].Value | sed 's/"//g') >> $filename
echo JWT_EXPIRES_SEC=$(aws ssm get-parameters --region ap-northeast-2 --names $path"JWT_EXPIRES_SEC" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo BCRYPT_SALT_ROUNDS=$(aws ssm get-parameters --region ap-northeast-2 --names $path"BCRYPT_SALT_ROUNDS" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo BCRYPT_RANDOM_WORDS=$(aws ssm get-parameters --region ap-northeast-2 --names $path"BCRYPT_RANDOM_WORDS" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo HOST_PORT=$(aws ssm get-parameters --region ap-northeast-2 --names $path"HOST_PORT" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo DB_HOST=$(aws ssm get-parameters --region ap-northeast-2 --names $path"DB_HOST" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo DB_USER=$(aws ssm get-parameters --region ap-northeast-2 --names $path"DB_USER" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo DB_DATABASE=$(aws ssm get-parameters --region ap-northeast-2 --names $path"DB_DATABASE" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo DB_PASSWORD=$(aws ssm get-parameters --region ap-northeast-2 --names $path"DB_PASSWORD" --with-decryption --query Parameters[0].Value | sed 's/"//g') >> $filename
echo CSRF_SECRET_KEY=$(aws ssm get-parameters --region ap-northeast-2 --names $path"CSRF_SECRET_KEY" --with-decryption --query Parameters[0].Value | sed 's/"//g') >> $filename
echo GH_CLIENT_ID=$(aws ssm get-parameters --region ap-northeast-2 --names $path"GH_CLIENT_ID" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo GH_CLIENT_SECRETS=$(aws ssm get-parameters --region ap-northeast-2 --names $path"GH_CLIENT_SECRETS" --with-decryption --query Parameters[0].Value | sed 's/"//g') >> $filename
echo AWS_S3_REGION=$(aws ssm get-parameters --region ap-northeast-2 --names $path"AWS_S3_REGION" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo AWS_S3_ID=$(aws ssm get-parameters --region ap-northeast-2 --names $path"AWS_S3_ID" --query Parameters[0].Value | sed 's/"//g') >> $filename
echo AWS_S3_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names $path"AWS_S3_SECRET" --with-decryption --query Parameters[0].Value | sed 's/"//g') >> $filename

sudo npm i