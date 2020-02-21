const { hashCsvFile, executeCommand, getCliKintoneCommand, makeQueryToGetAppData } = require('../../common/helper');
const { kintoneInfo, filesInfo} = require('../../common/config');

beforeAll(async () => {
    const command = getCliKintoneCommand()
        + ' -a ' + kintoneInfo.appId
        + ' -d ' + kintoneInfo.domain
        + ' -e ' + filesInfo.encoding
        + ' -u ' + kintoneInfo.username
        + ' -p ' + kintoneInfo.password
        + ' -D --import -f ' + filesInfo.import_file_path;
    await executeCommand(command);
})

describe('Export with --export option: ■Export data with output format (-o)', () => {
    test('Case 149: Verify that data can be exported in csv format', async () => {
        const query = makeQueryToGetAppData();
        const fieldNames = 'txt_firstName,txt_lastName,txt_description';
        const command = getCliKintoneCommand()
            + ' -a ' + kintoneInfo.appId
            + ' -d ' + kintoneInfo.domain
            + ' -e ' + filesInfo.encoding
            + ' -u ' + kintoneInfo.username
            + ' -p ' + kintoneInfo.password
            + ' -c ' + fieldNames
            + ' -q ' + query
            + ' -o ' + filesInfo.format.csv
            + ' --export > ' + filesInfo.export_file_path;

        const result = await executeCommand(command);
        const hashOfImportFile = await hashCsvFile(filesInfo.import_file_path);
        const hashOfExportFile = await hashCsvFile(filesInfo.export_file_path);

        expect(result).toEqual("");
        expect(hashOfImportFile).toEqual(hashOfExportFile);
    });

});