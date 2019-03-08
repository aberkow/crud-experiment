#!/bin/bash

# wait for the db to finish starting
# docker doesn't know when that will be, so it's important to check manually
/project/entrypoint/wait-for-it.sh mysqldb:3306 --strict -- echo "mysql is up"

# go to the project directory
cd /project

# install deps
npm install

# run the server
npm run start