#!/bin/bash

cd "$(dirname "$0")" || exit 1

browserify -r bitcoinjs-lib -s bitcoin | uglifyjs > bitcoinjs.min.js
browserify -r buffer -s buffer | uglifyjs > buffer.min.js

