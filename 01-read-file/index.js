const fs = require('fs');
const path = require('path');
const {stdout} = process;

let pathFile = path.join(__dirname, 'text.txt');
const read = fs.ReadStream(pathFile, 'utf-8');
read.on('data', chunk => stdout.write(chunk));