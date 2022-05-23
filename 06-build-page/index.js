const fs = require('fs');
const path = require('path');

run()

async function run() {
    const pathDist = path.join(__dirname, 'project-dist');
    const pathTemplate = path.join(__dirname, 'template.html');
    const pathAssets = path.join(__dirname, 'assets');
    const pathDistAsset = path.join(pathDist, 'assets');

    try {
        await createFolder(pathDist);
        await clearFolder(pathDist);
        let data = await getCode(pathTemplate);
        let layout = await createLayout(data);
        await writeCode(path.join(pathDist, 'index.html'), layout);
        await createStyle();
        await createFolder(pathDistAsset);
        await clearFolder(pathDistAsset);
        await copyFileRecursive(pathAssets, pathDistAsset);
    } catch (error) {
        console.log(error)
    }
}

async function createLayout(data) {
    let start = 0;
    let result = '';
    while (findComponent(data, start)) {
        let [a, b, component] = findComponent(data, start);
        let html = await getCode(path.join(__dirname, 'components', component + '.html'))
        result += data.substring(start, a);
        result += html + '\n';
        start = b;
    }

    return new Promise((resolve, reject) => {
        resolve(result);
        reject('ERROR: layout not create');
    })
}

function findComponent(string, start) {
    let a, b, component;
    a = string.indexOf('{{', start);
    b = string.indexOf('}}', start) + 2;
    if (a !== -1 && b !== -1) {
        component = string.substring(a + 2, b - 2);
        return [a, b + 0, component];
    }
    return null;
}

async function writeCode(pathFile, code) {
    const output = fs.createWriteStream(pathFile);
    output.write(code);
}

async function getCode(pathFile) {
    try {
        return fs.promises.readFile(pathFile, 'utf8');
    } catch (error) {
        console.log('get html -->', error);
    }
}

async function findAll(yourPath) {
    try {
        return await fs.promises.readdir(yourPath, { withFileTypes: true });
    } catch (error) {
        console.log("find foler --> ", error)
    }
}

async function findAllFile(yourPath) {
    try {
        return (await fs.promises.readdir(yourPath, { withFileTypes: true })).filter(item => !item.isDirectory());
    } catch (error) {
        console.log("find foler --> ", error)
    }
}

async function createFolder(yourPath) {
    try {
        return await fs.promises.mkdir(yourPath, { recursive: true });
    } catch (error) {
        console.log("create folder -->", error)
    }
}

async function clearFolder(yourDir) {
    let fileList = await findAllFile(yourDir);
    for (let item of fileList) {
        fs.unlink(path.join(yourDir, item.name), err => {
            if (err) console.log("unlink error --> ", err.message);
        });
    }
}

async function copyFileRecursive(from, to) {
    let fileList = await findAll(from);
    for (let item of fileList) {
        if(item.isDirectory()){
            await createFolder(path.join(to, item.name));
            await clearFolder(path.join(to, item.name));
            await copyFileRecursive(path.join(from, item.name), path.join(to, item.name))
        } else {
            fs.copyFile(
                path.join(from, item.name),
                path.join(to, item.name),
                err => {
                    if (err) console.log(err.message);
                }
            )
        }
    }
}

function createStyle() {
    const pathStylesDir = path.join(__dirname, 'styles');
    const pathBundleDir = path.join(__dirname, 'project-dist');
    const output = fs.createWriteStream(path.join(pathBundleDir, 'style.css'))

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