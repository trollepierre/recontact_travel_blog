#!/usr/bin/env bash

set -eu

echo "Check for pending changes"
if [[ $(git status --porcelain) ]]; then
  echo "You have uncommitted changes. You can not release. Please commit or stash your changes before releasing." >&2
  exit 1
fi

echo "Initial Condition"
git checkout master

echo "Fetch and pull branch dev on origin host"
git fetch origin dev
git pull origin dev
git branch -D dev
git checkout dev

echo "Fetch and pull branch master on origin host"
git fetch origin master
git pull origin master
git branch -D master
git checkout master

echo "Merge and push branch dev on master"
git merge --strategy-option=theirs dev --no-edit
git push origin master

echo "Rebase dev on master"
git checkout dev
git rebase origin/master
git push origin dev

exit 0
