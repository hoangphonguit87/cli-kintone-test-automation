const axios = require('axios').default;
const fs = require('fs');
const { makeQueryToGetAppData } = require('./helper');

const exportAppDataToJsonByApi = async (kintoneInfo, fieldNames) => {
    const userPasswordBase64 = Buffer.from(kintoneInfo.username + ':' + kintoneInfo.password).toString('base64');
    const url = 'https://' + kintoneInfo.domain
        + '/k/v1/records.json?app=' + kintoneInfo.appId
        + '&query=%20order%20by%20%24id%20asc'
        + '&' + _makeQuery(fieldNames);
    const headers = {
        'X-Cybozu-Authorization': userPasswordBase64,
        'Accept': '*',
    };

    try {
        const response = await axios({
            method: 'GET',
            url: url,
            headers: headers,
            responseType: 'json'
        });
        return response;
    }
    catch (e) {
        if (e.response) {
            return e.response;
        }
        else {
            return e;
        }
    }
};

const _makeQuery = (fieldNames) => {
    let fieldNameArray = fieldNames.split(',');
    let query = '';
    fieldNameArray.forEach(function (element, index) {
        if (index == 0) {
            query += 'fields[' + index + ']=' + element
        } else {
            query += '&fields[' + index + ']=' + element
        }
    });
    return query;
}

const makeJsonDatafile = (data, path) => {
    let json = JSON.stringify(data);
    try {
        fs.writeFile(path, json, 'utf8');
    } catch {
        console.log("Error: can not export json");
    }
}

module.exports = { exportAppDataToJsonByApi, makeJsonDatafile};

/** 
 *  Using exportAppDataToJsonByApi and export to json file
 * 
 * 
const { exportAppDataToJsonByApi, makeJsonDatafile } = require('../../common/apiUtils');
const { kintoneInfo, jsonFileInfo } = require('../../common/config');

describe('Get data from app by axios', () => {
    test('Test: getAppData func', async () => {
        const fieldNames = 'txt_firstName,txt_lastName,txt_description';

        await exportAppDataToJsonByApi(kintoneInfo, fieldNames).then((res, err) => {
            if(err) {
                console.log(err);
            }
            console.log(res.data['records']);
            makeJsonDatafile(res.data, jsonFileInfo.json_file_path)
        });
    });
});
*/