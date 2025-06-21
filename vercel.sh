#!/bin/zsh

echo "[!] Running custom vercel build script"
cd $(dirname $0) &&

# Build main project
npm run build &&

# Build admin project
cd bop-admin &&
npm run build &&

# Put admin project inside main project
cd .. &&
mv bop-admin/build build/admin