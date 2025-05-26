#!/usr/bin/env bash

grep -rw --color -E "\b$1\b" . --exclude-dir=node_modules/ --exclude-dir=config/ --exclude-dir=dist

