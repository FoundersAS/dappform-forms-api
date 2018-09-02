"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockstack = require('blockstack');
async function putFile(path, contents, encrypt = true) {
    try {
        await blockstack.putFile(path, JSON.stringify(contents), { encrypt });
    }
    catch (e) {
        console.error(e);
    }
}
exports.putFile = putFile;
async function getFile(path) {
    let json;
    let parsed;
    try {
        json = await blockstack.getFile(path);
    }
    catch (e) {
        console.log('getFile failed');
        console.error(e);
        return false;
    }
    if (!json) {
        console.info('Empty file. Form was probably deleted. ' + path);
        return false;
    }
    try {
        parsed = JSON.parse(json);
    }
    catch (e) {
        console.log('JSON.parse getFile contents failed');
        console.error(e);
        return false;
    }
    return parsed;
}
exports.getFile = getFile;
//# sourceMappingURL=blockstack.js.map