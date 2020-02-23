import getConfig from './getConfig';
import minimist from "minimist";
import reWriteFiles from './reWriteFiles';

(async function() {
    const config = await getConfig();
    const params = minimist(process.argv.slice(2));
    reWriteFiles(config, params);
})()