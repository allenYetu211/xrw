#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var minimist = _interopDefault(require('minimist'));

// console.log('fs', fs)
const filePath = path.resolve(`${process.cwd()}/rewrite.config.json`);

const getRewriteConfig = () => {
  return new Promise((resolve , reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {

        if (err) {
          reject(err);
        }

        if (data ) {
          resolve(JSON.parse(data));
        }
    });
  })
};

const buildPath = path.resolve(`${process.cwd()}/${config[item].buildPath }`);


// 拷贝内容
const copyFiles = (buildPath, isFilter, callback) => {
  fs.readdir(buildPath, (err, files) => {
    if (err) {
      console.warn(`获取dir失败：${buildPath}\n Error Info: ${err}`);
      return 
    }
    files.forEach((filesName) => {
      // 过滤不需要匹配的文件
      if(isFilter && !utilFiltrFiles(path.extname(filesName))) {
        return
      }
      const filedir = path.join(buildPath, filesName);

      fs.stat(filedir,(statError, stats) => {
        if (statError) {
          console.warn(`获取stat失败文件名称：${filedir}\n Error Info: ${statError}`);
          return
        }
        const isFile = stats.isFile();//是文件
        const isDir = stats.isDirectory();//是文件夹

        if(isFile){
          // console.log(filedir);
          callback({filedir, filesName});
        }

        if(isDir) {
          traverseRewrite(filedir);
        }
      });

    });
  });
};

// 过滤文件
const utilFiltrFiles = (filesExtname) => {
  const supportiveExtaname = ['.js', '.html', ''];
  return supportiveExtaname.includes(filesExtname)
};

let reWriteConfig = '';

// 根据配置对局读取信息
const reWriteFiles = (config, params) => {
  params._.forEach((item) => {

    if (!config[item]) {
      console.error(`${item} 未找到目标位置项`);
      return  
    }

    reWriteConfig = config[item];
    const buildPath = path.resolve(`${process.cwd()}/${config[item].buildPath }`);
    // traverseRewrite(buildPath)
    copyFiles(buildPath, true, ({filedir, filesName}) => {
      const content = fs.readFileSync(filedir, 'utf-8');
      const newContent = reWriteContent(content);
      fs.writeFile(filedir, newContent, (err) => {
        if (err) throw err;
        console.log(`${filesName} 重写完成`);
      });
    });
  });
};


// 重写内容
const reWriteContent = (content) => {
  const trOBJ = reWriteConfig.rewriteContainer;
  let newContent = content;
  Object.keys(trOBJ).forEach((key) => {
   
    newContent = newContent.replace( new RegExp(key,'g'), trOBJ[key] );
  });
  return newContent;
};

(async function() {
    const config = await getRewriteConfig();
    const params = minimist(process.argv.slice(2));
    reWriteFiles(config, params);
})();
