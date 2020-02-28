const fs = require('fs-extra');
const mv = require('mv');
const request = require('request');
const unzip = require('unzip-stream');

const releasedVersion = 'v0.10.1';
const baseRealeasedUrl = `https://github.com/kintone/cli-kintone/releases/download/${releasedVersion}`;
const platforms = {
    // Ref: https://nodejs.org/api/process.html#process_process_platform
    macOS: 'darwin', windows: 'win32', linux: ['linux', 'freebsd', 'openbsd', 'sunos', 'aix']
}

const getCompatibleBuild = platform => {
    let buildInfo = {}
    switch (platform) {
        case platforms.macOS:
            buildInfo = {
                fileName: 'cli-kintone',
                filePath: 'build/macos-x64/',
                archiveName: 'macos-x64.zip',
                releasedUrl: `${baseRealeasedUrl}/macos-x64.zip`
            };
            break;
        case platforms.windows:
            buildInfo = {
                fileName: 'cli-kintone.exe',
                filePath: 'build/windows-x64/',
                archiveName: 'windows-x64.zip',
                platforms: `${baseRealeasedUrl}/windows-x64.zip`
            };
            break;
        default: // linux cases
            buildInfo = {
                fileName: 'cli-kintone',
                filePath: 'build/linux-x64/',
                archiveName: 'linux-x64.zip',
                releasedUrl: `${baseRealeasedUrl}/linux-x64.zip`
            }
    }
    return buildInfo;
}

async function dowloadCliKintoneBuild(releasedUrl, archiveName) {
    return new Promise((resolve, reject) => {
        request(releasedUrl)
            .pipe(fs.createWriteStream(archiveName))
            .on('close', () => {
                resolve();
            });
    });
}

async function unzipCliKintoneBuild(archiveName) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(`./${archiveName}`)
            .pipe(unzip.Extract({ path: './' }))
            .on('close', () => {
                resolve();
            });
    });
}

async function moveCliKintoneToRootFolder(filePath, fileName) {
    const currentPath = `./${filePath}${fileName}`;
    const newPath = `./${fileName}`;

    mv(currentPath, newPath, err => {
        if (err) {
            console.error(err);
        } else {
            fs.chmodSync(newPath, '777');
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

async function removeBuildArchive(archiveName) {
    fs.unlinkSync(archiveName);
}

module.exports = async () => {
    const buildInfo = getCompatibleBuild(process.platform);
    const path = './' + buildInfo.fileName;

    if (!fs.existsSync(path)) {
        console.log('\n--------- START PREPARATION CLI-KINTONE BUILD ----------');

        console.log('start dowloading ... ');
        await dowloadCliKintoneBuild(buildInfo.releasedUrl, buildInfo.archiveName);
        console.log('dowload finished');

        console.log('start unzip ... ');
        await unzipCliKintoneBuild(buildInfo.archiveName);
        console.log('unzip finished ... ');

        console.log('move cli to root ... ');
        await moveCliKintoneToRootFolder(buildInfo.filePath, buildInfo.fileName);
        console.log('move finished ... ');

        console.log('remove build folder ... ');
        await removeBuildFolder('./build');
        console.log('remove finshed ... ');

        console.log('remove archive folder ... ');
        await removeBuildArchive(buildInfo.archiveName);
        console.log('remove finshed ... ');

        console.log('--------- FINISHED PREPARATION CLI-KINTONE BUILD ----------');
    } else {
        console.log('\n--------- CLI-KINTONE EXIST ----------');
    }
};