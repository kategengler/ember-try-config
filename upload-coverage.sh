#!/usr/bin/env bash
CODECLIMATE_REPO_TOKEN=702d3e6c4671fa191c7538bb0110d6e3308662cd7f5c8359008bc10144be7d7a node_modules/.bin/codeclimate-test-reporter < coverage/lcov.info
