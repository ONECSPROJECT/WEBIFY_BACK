#!/usr/bin/env bash

grep -rwl --color -E "\b$1\b" . --exclude-dir=node_modules/ --exclude-dir=config/ --exclude-dir=dist | xargs sed -i "s/\b$1\b/$2/g"

