#!/usr/bin/env/bash
user=$(whoami);
node_version=$(node -v);
curl -s --user 'api:key-3075814173e2d2b878fcc614981e3444' https://api.mailgun.net/v3/sandbox0efb1a68e1a94a56a5b0131e19cb4340.mailgun.org/messages -F from='scorekeeper <scorekeeper@fearlessmagicians.com>' -F to=wilsonjusuf1998@gmail.com -F subject="New scorekeeper run" -F text="$user has node version: $node_version."
