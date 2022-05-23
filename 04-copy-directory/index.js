const fs = require('fs');
const path = require('path');

async function createFolder(yourPath) {
    try {
        return await fs.promises.mkdir(yourPath, { recursive: true });
    } catch (error) {
        console.log("create folder -->", error)
    }
}

async function findAllFile(yourPath) {
    try {
        return (await fs.promises.readdir(yourPath, { withFileTypes: true })).filter(item => !item.isDirectory());
    } catch (error) {
        console.log("find foler --> ", error)
    }
}

async function clearFolder(yourDir) {
    let fileList = await findAllFile(yourDir);
    for (let item of fileList) {
        fs.unlink(path.join(yourDir, item.name), err => {
            if (err) console.log("unlink error --> ", err.message)
        });
    }
}

async function copyFile(from, to) {
    let fileList = await findAllFile(from);
    for (let item of fileList) {
        fs.copyFile(
            path.join(from, item.name),
            path.join(to, item.name),
            err => {
                if (err) console.log(err.message);
            }
        )
    }
}

async function main(){
    const originDir = path.join(__dirname, 'files');
    const copyDir = path.join(__dirname, 'files-copy');
    try {
        await createFolder(copyDir);
        await clearFolder(copyDir);
        await copyFile(originDir, copyDir);
    } catch (error) {
        console.log(error)
    }
}

main();


