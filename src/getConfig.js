import fsExtra from 'fs-extra';
import path from "path";

// console.log('fs', fs)
const filePath = path.resolve(`${process.cwd()}/rewrite.config.json`)

const getRewriteConfig = () => {
  return new Promise((resolve , reject) => {
    fsExtra.readFile(filePath, 'utf-8', (err, data) => {

        if (err) {
          reject(err)
        }

        if (data ) {
          resolve(JSON.parse(data))
        }
    });
  })
}
export default getRewriteConfig;



