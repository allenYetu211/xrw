import fs from "fs";
import path from "path";

let reWriteConfig = '';

// 根据配置对局读取信息
const reWriteFiles = (config, params) => {
  params._.forEach((item) => {

    if (!config[item]) {
      console.error(`${item} 未找到目标位置项`)
      return  
    }

    reWriteConfig = config[item];
    const buildPath = path.resolve(`${process.cwd()}/${config[item].buildPath }`)
    traverseRewrite(buildPath)
  })
}

// 获取文件 
const traverseRewrite = (buildPath) => {
  fs.readdir(buildPath, (err, files) => {
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

      fs.stat(filedir,(statError, stats) => {
        if (statError) {
          console.warn(`获取stat失败文件名称：${filedir}\n Error Info: ${statError}`);
          return
        }
        const isFile = stats.isFile();//是文件
        const isDir = stats.isDirectory();//是文件夹

        if(isFile){
          // console.log(filedir);
          const content = fs.readFileSync(filedir, 'utf-8');
          const newContent = reWriteContent(content);
          fs.writeFile(filedir, newContent, (err) => {
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
  const supportiveExtaname = ['.js', '.html', ''];
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