import getConfig from './getConfig';
import minimist from "minimist";
import reWriteFiles from './reWriteFiles';

(async function() {
    const config = await getConfig();
    console.log('process.argv', process.argv)
    const params = minimist(process.argv.slice(2));
    console.log(params)
    reWriteFiles(config, params);
})()