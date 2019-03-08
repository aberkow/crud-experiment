#!/bin/bash

/project/entrypoint/wait-for-it.sh mysqldb:3306 --strict -- echo "mysql is up"

cd /project

npm install

npm run start