#!/bin/bash

git config user.name "Nikita Tsukanov"
git config user.email "keks9n@gmail.com"

git remote remove origin 2>/dev/null || true
git remote add origin git@github.com:MetadeelOrg/Metadeel-website.git

GIT_AUTHOR_DATE="2026-06-07T18:18:05+05:00" \
GIT_COMMITTER_DATE="2026-06-07T18:18:09+05:00" \
git commit -m "init"

git push -f origin master