const fs = require('fs');
const path = require('path');

function run() {
    const pathStylesDir = path.join(__dirname, 'styles');
    const pathBundleDir = path.join(__dirname, 'project-dist');
    const output = fs.createWriteStream(path.join(pathBundleDir, 'bundle.css'))

    fs.readdir(pathStylesDir, {withFileTypes: true}, (err, list) => {
        if (err) console.log(err.message);
        list = list.filter(item => {
            return !item.isDirectory() && path.extname(item.name) === '.css';
        });

        for (let file of list) {
            let input = fs.createReadStream(
                path.join(pathStylesDir, file.name),
                'utf8'
            );

            input.on('data', chunk => {
                output.write(chunk);
            })
        }
    })
}

run();
