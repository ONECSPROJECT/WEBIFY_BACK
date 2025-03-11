#!/bin/bash

mariadb -u root -password="$MARIADB_ROOT_PASSWORD" suphours -e 'source ./init.sql'
