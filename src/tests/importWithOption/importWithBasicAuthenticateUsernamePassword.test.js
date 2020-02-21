const { executeCommand, getCliKintoneCommand } = require('../../common/helper');
const { filesInfo, basicAuthenticationInfo } = require('../../common/config');

describe.skip('Import with --import option: Basic Authentication with params (-U) (-P)', () => {
    test('C024: Verify that data is imported correctly with correct Basic Authentication Username/Password', async () => {
        const command = getCliKintoneCommand()
            + ' -a ' + basicAuthenticationInfo.appId
            + ' -d ' + basicAuthenticationInfo.domain
            + ' -e ' + filesInfo.encoding
            + ' -u ' + basicAuthenticationInfo.username
            + ' -p ' + basicAuthenticationInfo.password
            + ' -U ' + basicAuthenticationInfo.basicUsername
            + ' -P ' + basicAuthenticationInfo.basicPassword
            + ' --import -f ' + filesInfo.import_file_path;
        const result = await executeCommand(command);

        expect(result).toEqual(expect.stringContaining('SUCCESS'));
        expect(result).toEqual(expect.stringContaining('DONE'));
    });

    test('C025: Verify that error will be displayed when missing both Basic Authentication username and password', async () => {
        const command = getCliKintoneCommand()
            + ' -a ' + basicAuthenticationInfo.appId
            + ' -d ' + basicAuthenticationInfo.domain
            + ' -e ' + filesInfo.encoding
            + ' -u ' + basicAuthenticationInfo.username
            + ' -p ' + basicAuthenticationInfo.password
            + ' --import -f ' + filesInfo.import_file_path;
        const result = await executeCommand(command);

        expect(result.toString()).toEqual(expect.stringContaining('HTTP error: 401 Unauthorized'));
    });

    test('C026: Verify that error will be displayed when missing Basic Authentication username', async () => {
        const command = getCliKintoneCommand()
            + ' -a ' + basicAuthenticationInfo.appId
            + ' -d ' + basicAuthenticationInfo.domain
            + ' -e ' + filesInfo.encoding
            + ' -u ' + basicAuthenticationInfo.username
            + ' -p ' + basicAuthenticationInfo.password
            + ' -P ' + basicAuthenticationInfo.basicPassword
            + ' --import -f ' + filesInfo.import_file_path;
        const result = await executeCommand(command);

        expect(result.toString()).toEqual(expect.stringContaining('HTTP error: 401 Unauthorized'));
    });

    test('C028: Verify that error will be displayed when using wrong Basic Authentication username', async () => {
        const command = getCliKintoneCommand()
            + ' -a ' + basicAuthenticationInfo.appId
            + ' -d ' + basicAuthenticationInfo.domain
            + ' -e ' + filesInfo.encoding
            + ' -u ' + basicAuthenticationInfo.username
            + ' -p ' + basicAuthenticationInfo.password
            + ' -U ' + basicAuthenticationInfo.wrongBasicUsername
            + ' -P ' + basicAuthenticationInfo.basicPassword
            + ' --import -f ' + filesInfo.import_file_path;
        const result = await executeCommand(command);

        expect(result.toString()).toEqual(expect.stringContaining('HTTP error: 401 Unauthorized'));
    });

    test('C029: Verify that error will be displayed when using wrong Basic Authentication password', async () => {
        const command = getCliKintoneCommand()
            + ' -a ' + basicAuthenticationInfo.appId
            + ' -d ' + basicAuthenticationInfo.domain
            + ' -e ' + filesInfo.encoding
            + ' -u ' + basicAuthenticationInfo.username
            + ' -p ' + basicAuthenticationInfo.password
            + ' -U ' + basicAuthenticationInfo.basicUsername
            + ' -P ' + basicAuthenticationInfo.wrongBasicPassword
            + ' --import -f ' + filesInfo.import_file_path;
        const result = await executeCommand(command);

        expect(result.toString()).toEqual(expect.stringContaining('HTTP error: 401 Unauthorized'));
    });
});