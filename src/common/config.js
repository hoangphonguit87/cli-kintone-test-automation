const fileType = {
    csv: 'csv',
    json: 'json'
}

const kintoneInfo = {
    appId: 1,
    domain: 'clitool.kintone.com',
    username: 'phonghoang.cybozu@gmail.com',
    password: 'clitool123',
    token: 'hNSZkLg3EfZrJcNhzKxUaOB9uE2x6lxdmIawYlRk'
}

const kintoneInvalidInfo = {
    appId: 100000,
    domain: 'invalid-cli-kintone.cybozu-dev.com',
    wrong_username: 'cybozu123',
    wrong_password: 'cybozu123',
    token: 'invalidtokentotest'

}

const basicAuthenticationInfo = {
    appId: 1,
    domain: '******.****-***.****',
    username: '******',
    password: '******',
    basicUsername: '******',
    basicPassword: '******@******',
    wrongBasicUsername: '******',
    wrongBasicPassword: '******',
}

const userNoViewPermission = {
    username: 'user1',
    password: 'user1@123',
}

const filesInfo = {
    encoding: 'utf-8',
    format: fileType,
    import_file_path: 'src/resources/testData/import_data.csv',
    export_file_path: 'src/resources/export_data.csv'
}

const jsonFileInfo = {
    json_file_path: 'src/resources/appData.json',
}

module.exports = {
    kintoneInfo,
    kintoneInvalidInfo,
    filesInfo,
    userNoViewPermission,
    basicAuthenticationInfo,
    jsonFileInfo
};