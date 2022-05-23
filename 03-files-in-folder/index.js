const fs = require('fs');
const path = require('path');

async function readDirectory(pathToDir){
    let fileList;
    try {
        fileList = (await fs.promises.readdir(pathToDir, {withFileTypes: true}))
            .filter(item => !item.isDirectory());
    } catch (error) {
        console.log('Error read directory --> ' + error.message);
    }

    try {
        for(let item of fileList) {
            let fileScan = await fs.promises.stat(path.join(pathToDir, item.name));
            let size = `${(fileScan.size / 1024)}kb`;
            let ext = path.extname(item.name).substring(1);
            let name = item.name.slice(0, -1*(ext.length + 1))
            console.log(`${name} - ${ext} - ${size}`);
        }
    } catch (error) {
        console.log('Error show file`s details  --> ' + error.message);
    }
}

const pathDir = path.join(__dirname, 'secret-folder');
readDirectory(pathDir)
