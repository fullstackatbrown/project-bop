#!/bin/zsh

cd $(dirname $0) &&

# Build main project
npm run build &&

# Build admin project
cd bop-admin &&
npm run build &&

# Put admin project inside main project
cd .. &&
mv bop-admin/build build/admin &&

# Deploy to Github
cd build &&
git init &&
git remote add origin git@github.com:sjuknelis/bop-deploy.git &&
git add . &&
git commit -m "deploy $(date)" &&
git push origin main -f