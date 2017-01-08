#!/bin/bash

# IMPORTANT
# ---------
# This is an auto generated file with React CDK.
# Do not modify this file.
# Use `.scripts/user/prepublish.sh instead`.

echo "=> Transpiling 'src' into ES5 ..."
echo ""
rm -rf ./dist
NODE_ENV=production ./node_modules/.bin/babel --ignore tests,stories --plugins "transform-runtime" ./src --out-dir ./dist
cp -Rf ./src/static/ ./dist/static/
echo ""
echo "=> Transpiling completed."

. .scripts/user/prepublish.sh
