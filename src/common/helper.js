const { exec } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');

const os_system = process.platform;

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function executeCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        resolve(error);
      }
      if (stderr) {
        resolve(stderr);
      }

      resolve(stdout);
    });
  });
}

/**
 * Hash csv file to string by SHA-256
 * @param filePath {string}
 * @param algorithm {string}
 * @return {Promise<string>}
 */
function hashCsvFile(filePath, algorithm = 'sha256') {
  return new Promise((resolve, reject) => {
    let shasum = crypto.createHash(algorithm);
    try {
      let s = fs.ReadStream(filePath)
      s.on('data', function (data) {
        shasum.update(data)
      })

      s.on('end', function () {
        const hash = shasum.digest('hex')
        return resolve(hash);
      })
    } catch (error) {
      return reject('calc fail');
    }
  });
}

/**
 * Detect OS (Window, Linux, Mac OS) then return cli-kintone command
 */
function getCliKintoneCommand() {  
  if (os_system == 'darwin') {
    return './cli-kintone'
  } else if (os_system == 'win32') {
    return 'cli-kintone.exe'
  } else {
    return './cli-kintone'
  }
}

/**
 * Make query to get data from app on kintone
 */
function makeQueryToGetAppData() {
  if (os_system == 'win32') {
    return '"order by $id asc"';
  } else {
    return '"order by \\$id asc"';
  }
}

module.exports = { 
  hashCsvFile, 
  executeCommand, 
  getCliKintoneCommand, 
  makeQueryToGetAppData 
};