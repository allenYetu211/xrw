import fsExtra from 'fs-extra';
import path from "path";

let reWriteConfig = '';

// 根据配置对局读取信息
const reWriteFiles =  (config, params) => {
  params._.forEach( async (item) => {

    if (!config[item]) {
      console.error(`${item} 未找到目标位置项`)
      return  
    }

    if (/\//g.test(config[item].buildPath)) {
      console.log('buildPath 目录下不能携带')
    }

    reWriteConfig = config[item];

    const buildPath = path.resolve(`${process.cwd()}/${config[item].buildPath}`);
    const backupsFiles = path.resolve(`${process.cwd()}/cp-${config[item].buildPath.replace(/(^\/*)|(\/*$)/g, '')}`);


    // 验证是否存在拷贝
    const verify = await fsExtra.pathExists(buildPath);
    if (!verify) {
      console.warn(`目标文件未找到：${buildPath}`);
      return
    } 

    try {
      await fsExtra.copy(buildPath, backupsFiles)
      traverseRewrite(backupsFiles);
    } catch(e) {
      console.log(e)
    }

  })
}

// 获取文件 
const traverseRewrite = (buildPath) => {
  fsExtra.readdir(buildPath, (err, files) => {
    if (err) {
      console.warn(`获取dir失败：${buildPath}\n Error Info: ${err}`);
      return 
    }
    files.forEach((filesName) => {
      // 过滤不需要匹配的文件
      if(!utilFiltrFiles(path.extname(filesName))) {
        return
      }
      const filedir = path.join(buildPath, filesName);

      fsExtra.stat(filedir,(statError, stats) => {
        if (statError) {
          console.warn(`获取stat失败文件名称：${filedir}\n Error Info: ${statError}`);
          return
        }
        const isFile = stats.isFile();//是文件
        const isDir = stats.isDirectory();//是文件夹

        if(isFile){
          // console.log(filedir);
          const content = fsExtra.readFileSync(filedir, 'utf-8');
          const newContent = reWriteContent(content);
          fsExtra.writeFile(filedir, newContent, (err) => {
            if (err) throw err;
            console.log(`${filesName} 重写完成`);
          })
        }

        if(isDir) {
          traverseRewrite(filedir);
        }
      })

    })
  })
}
// 过滤文件
const utilFiltrFiles = (filesExtname) => {
  const supportiveExtaname = ['.js', '.html', '.css', ''];
  return supportiveExtaname.includes(filesExtname)
}

// 重写内容
const reWriteContent = (content) => {
  const trOBJ = reWriteConfig.rewriteContainer;
  let newContent = content;
  Object.keys(trOBJ).forEach((key) => {
   
    newContent = newContent.replace( new RegExp(key,'g'), trOBJ[key], )
  })
  return newContent;
}

export default reWriteFiles;