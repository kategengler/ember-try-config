#!/usr/bin/env bash
CODECLIMATE_REPO_TOKEN= node_modules/.bin/codeclimate-test-reporter < coverage/lcov.info
