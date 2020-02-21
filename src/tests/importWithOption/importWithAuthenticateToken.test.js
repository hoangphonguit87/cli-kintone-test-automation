const { executeCommand, getCliKintoneCommand } = require('../../common/helper');
const { kintoneInfo, kintoneInvalidInfo, filesInfo} = require('../../common/config');

describe.skip('Import with --import option: ■Authenticate with token (-t)', () => {
  test('C031: Verify that data can be imported with API Token', async () => {
    const command = getCliKintoneCommand()
      + ' -a ' + kintoneInfo.appId
      + ' -d ' + kintoneInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -t ' + kintoneInfo.token
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result).toEqual(expect.stringContaining('SUCCESS'));
    expect(result).toEqual(expect.stringContaining('DONE'));
  });

  test('C032: Verify that error will be displayed when using wrong API Token', async () => {
    const command = getCliKintoneCommand()
      + ' -a ' + kintoneInfo.appId
      + ' -d ' + kintoneInfo.domain
      + ' -e ' + filesInfo.encoding
      + ' -t ' + kintoneInvalidInfo.token
      + ' --import -f ' + filesInfo.import_file_path;
    const result = await executeCommand(command);

    expect(result.toString()).toEqual(expect.stringContaining('GAIA_IA02'));
    expect(result.toString()).toEqual(expect.stringContaining('指定したAPIトークンは、アプリで生成されたトークンと異なります。'));
    expect(result.toString()).toEqual(expect.stringContaining('アプリのAPIトークンの設定を確認してください。'));
    expect(result.toString()).toEqual(expect.stringContaining('設定が正しい場合、APIトークンの設定がアプリに反映されていない場合があります。'));
    expect(result.toString()).toEqual(expect.stringContaining('アプリの設定を更新し、APIトークンの設定をアプリに反映します。'));
  });
});