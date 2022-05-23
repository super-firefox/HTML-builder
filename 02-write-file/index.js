const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;

const pathFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathFile);

stdout.write('Please, input text ... \n');

stdin.on('data', data => {
    if(data.toString().trim() === 'exit') {
        process.exit();
    } else {
        output.write(data);
    }
});

process.on('exit', () => stdout.write('Good Bye!!!'));

process.on('SIGINT', () => process.exit())