const { executeCommand, getCliKintoneCommand } = require('../../common/helper');
const { kintoneInfo, kintoneInvalidInfo, filesInfo, userNoViewPermission } = require('../../common/config');

describe('Import with --import option: Authenticate with username/password (-u) (-p)', () => {
  test('C011: Verify that data is imported correctly with username/password for an app', async () => {
    const command = getCliKintoneCommand()
      + ' -a ' + kintoneInfo.appId
      + ' -d ' + kintoneInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -u ' + kintoneInfo.username
      + ' -p ' + kintoneInfo.password
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result).toEqual(expect.stringContaining('SUCCESS'));
    expect(result).toEqual(expect.stringContaining('DONE'));
  });

  test.skip('C012 - Verify that error will be displayed when importing data with wrong username', async () => {
    const command = getCliKintoneCommand()
      + ' -a ' + kintoneInfo.appId
      + ' -d ' + kintoneInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -u ' + kintoneInvalidInfo.wrong_username
      + ' -p ' + kintoneInfo.password
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result.toString()).toEqual(expect.stringContaining('CB_WA01'));
    expect(result.toString()).toEqual(expect.stringContaining('ユーザーのパスワード認証に失敗しました'));
    expect(result.toString()).toEqual(expect.stringContaining('X-Cybozu-Authorization'));
    expect(result.toString()).toEqual(expect.stringContaining('ヘッダーの値が正しくありません'));
  });

  test.skip('C013 - Verify that error will be displayed when importing data with wrong password', async () => {
    const command = getCliKintoneCommand()
      + ' -a ' + kintoneInfo.appId
      + ' -d ' + kintoneInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -u ' + kintoneInfo.username
      + ' -p ' + kintoneInvalidInfo.wrong_password
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result.toString()).toEqual(expect.stringContaining('CB_WA01'));
    expect(result.toString()).toEqual(expect.stringContaining('ユーザーのパスワード認証に失敗しました'));
    expect(result.toString()).toEqual(expect.stringContaining('X-Cybozu-Authorization'));
    expect(result.toString()).toEqual(expect.stringContaining('ヘッダーの値が正しくありません'));
  });

  test('C015 - When not providing password: Input correct password and verify that data is imported correctly', async () => {
    const command = 'echo ' + kintoneInfo.password + '|' + getCliKintoneCommand()
      + ' -a ' + kintoneInfo.appId
      + ' -d ' + kintoneInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -u ' + kintoneInfo.username
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result).toEqual(expect.stringContaining('SUCCESS'));
    expect(result).toEqual(expect.stringContaining('DONE'));
  });

  test.skip('C016 - When not providing password: Input wrong password and verify that error will be displayed', async () => {
    const command = 'echo ' + kintoneInvalidInfo.wrong_password + '|' + getCliKintoneCommand()
      + ' -a ' + kintoneInfo.appId
      + ' -d ' + kintoneInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -u ' + kintoneInfo.username
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result.toString()).toEqual(expect.stringContaining('CB_WA01'));
    expect(result.toString()).toEqual(expect.stringContaining('ユーザーのパスワード認証に失敗しました'));
    expect(result.toString()).toEqual(expect.stringContaining('X-Cybozu-Authorization'));
    expect(result.toString()).toEqual(expect.stringContaining('ヘッダーの値が正しくありません'));
  });

  test.skip('C017 - Verify that error will be displayed with user who doesn’t have View record permission for an app', async () => {
    const command = getCliKintoneCommand()
      + ' -a ' + kintoneInfo.appId
      + ' -d ' + kintoneInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -u ' + userNoViewPermission.username
      + ' -p ' + userNoViewPermission.password
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result.toString()).toEqual(expect.stringContaining('AppError'));
    expect(result.toString()).toEqual(expect.stringContaining('403'));
    expect(result.toString()).toEqual(expect.stringContaining('CB_NO02'));
    expect(result.toString()).toEqual(expect.stringContaining('権限がありません。'));
  });

  test.skip('C018 - Verify that error will be displayed when executing command with wrong App ID', async () => {
    const command = getCliKintoneCommand()
      + ' -a ' + kintoneInvalidInfo.appId
      + ' -d ' + kintoneInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -u ' + userNoViewPermission.username
      + ' -p ' + userNoViewPermission.password
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result.toString()).toEqual(expect.stringContaining('AppError'));
    expect(result.toString()).toEqual(expect.stringContaining('404'));
    expect(result.toString()).toEqual(expect.stringContaining('GAIA_AP01'));
    expect(result.toString()).toEqual(expect.stringContaining('指定したアプリ（id: ' + kintoneInvalidInfo.appId + '）が見つかりません。'));
    expect(result.toString()).toEqual(expect.stringContaining('削除されている可能性があります。'));
  });

  test('C019 - Verify that error will be displayed when executing command with wrong Domain', async () => {
    const command = getCliKintoneCommand()
      + ' -a ' + kintoneInfo.appId
      + ' -d ' + kintoneInvalidInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -u ' + userNoViewPermission.username
      + ' -p ' + userNoViewPermission.password
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result.toString()).toEqual(expect.stringContaining('HTTP error'));
    expect(result.toString()).toEqual(expect.stringContaining('404 Not Found'));
  });

  test('C020 - Verify that error will be displayed when executing command with wrong Domain and App', async () => {
    const command = getCliKintoneCommand()
      + ' -a ' + kintoneInvalidInfo.appId
      + ' -d ' + kintoneInvalidInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -u ' + userNoViewPermission.username
      + ' -p ' + userNoViewPermission.password
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result.toString()).toEqual(expect.stringContaining('HTTP error'));
    expect(result.toString()).toEqual(expect.stringContaining('404 Not Found'));
  });

  test('C021 - Verify that error will be displayed when executing with duplicated params', async () => {
    const command = getCliKintoneCommand()
      + ' -a -a ' + kintoneInfo.appId
      + ' -d ' + kintoneInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -u ' + userNoViewPermission.username
      + ' -p ' + userNoViewPermission.password
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result.toString()).toEqual(expect.stringContaining('expected argument for flag `-a'));
    expect(result.toString()).toEqual(expect.stringContaining('but got option `-a'));
  });
});