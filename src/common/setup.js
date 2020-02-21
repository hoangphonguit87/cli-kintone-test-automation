const fs = require('fs-extra');
const mv = require('mv');
const request = require('request');
const unzip = require('unzip-stream');

const os_system = process.platform;
const linux_url = 'https://github.com/kintone/cli-kintone/releases/download/v0.10.1/linux-x64.zip';
const windows_url = 'https://github.com/kintone/cli-kintone/releases/download/v0.10.1/windows-x64.zip';
const mac_url = 'https://github.com/kintone/cli-kintone/releases/download/v0.10.1/macos-x64.zip';

function getFileName() {
    if (os_system == 'darwin') {
        return 'cli-kintone';
    } else if (os_system == 'win32') {
        return 'cli-kintone.exe';
    } else {
        return 'cli-kintone';
    }
}

function getBuildPath() {
    if (os_system == 'darwin') {
        return 'build/macos-x64/';
    } else if (os_system == 'win32') {
        return 'build/windows-x64/';
    } else {
        return 'build/linux-x64/';
    }
}

function getArchiveName() {
    if (os_system == 'darwin') {
        return 'macos-x64.zip';
    } else if (os_system == 'win32') {
        return 'windows-x64.zip';
    } else {
        return 'linux-x64.zip';
    }
}

function getRealUrl() {
    if (os_system == 'darwin') {
        return mac_url;
    } else if (os_system == 'win32') {
        return windows_url;
    } else {
        return linux_url;
    }
}

async function dowloadCliKintoneBuild() {
    return new Promise((resolve, reject) => {
        request(getRealUrl())
            .pipe(fs.createWriteStream(getArchiveName()))
            .on('close', function () {
                resolve();
            });
    });
}

async function unzipCliKintoneBuild() {
    const zip_path = './' + getArchiveName();

    return new Promise ((resolve, reject) => { 
        fs.createReadStream(zip_path)
        .pipe(unzip.Extract({ path: './' }))
        .on('close', function () {
            resolve();
        });
    });
}

async function moveCliKintoneToRootFolder() {
    const old_path = './' + getBuildPath() + getFileName();
    const new_path = './' + getFileName();

    mv(old_path, new_path, function (err) {
        if (err) {
            console.log(err);
        } else {
            fs.chmodSync(new_path, '777');
        }
    });
}

async function removeBuildFolder() {
    try {
        await fs.remove('./build')
    } catch (err) {
        console.error(err)
    }
}

async function removeBuildArchive() {
    fs.unlinkSync(getArchiveName());
}

module.exports = async () => {
    const path = './' + getFileName();

    if (!fs.existsSync(path)) {
        console.log('\n--------- START PREPARATION CLI-KINTONE BUILD ----------');

        console.log('start dowloading ... ');
        await dowloadCliKintoneBuild();
        console.log('dowload finished');

        console.log('start unzip ... ');
        await unzipCliKintoneBuild();
        console.log('unzip finished ... ');

        console.log('move cli to root ... ');
        await moveCliKintoneToRootFolder();
        console.log('move finished ... ');

        console.log('remove build folder ... ');
        await removeBuildFolder('./build');
        console.log('remove finshed ... ');

        console.log('remove archive folder ... ');
        await removeBuildArchive();
        console.log('remove finshed ... ');

        console.log('--------- FINISHED PREPARATION CLI-KINTONE BUILD ----------');
    } else {
        console.log('\n--------- CLI-KINTONE EXIST ----------');
    }
};