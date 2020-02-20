## 多环境重写配置工具

>  解决问题
- 前端需要根据多个环境进行编译耗时过长
- 各个项目针对不同的环境配置脚本过于繁杂，需要配置多个package script脚本

> 安装
```
yarn add xrw -dev
```

---
> 前置条件
- 在目标项目将需要替换的内容修改成指定的特殊字符。

```
// 例: 目标项目中的，package.json

 "build:testMobile": "cross-env PUBLIC_URL={{cdnPath}} BUILD_MODULE=mobile node scripts/build.js rwp",

```


> 配置
- package.json 
```json
{
  "scripts" :{
    "xrw": "xrw"
  }
}
```
- 根目录新建文件 rewrite.config.json
```json
{
  "mobile": { 
    "buildPath" : "/build-mobile/", // 执行重写的文件夹
    "rewriteContainer": {  // 替换内容
      "{{servicePath}}": "cloud.xylink.com", 
      "{{cdnPath}}": "cdn.xylink.com"
    }
  },
  "pc": { 
    "buildPath" : "/build-pc/", // 执行重写的文件夹
    "rewriteContainer": {  // 替换内容
      "{{servicePath}}": "cloud.xylink.com", 
      "{{cdnPath}}": "cdn.xylink.com"
    }
  }
}
```

> 使用
```js
// mobile 与 rewrite.config.json 中需要匹配
yarn xrw mobile 

// 可同时支持多个文件目录的修改
yarn xrw pc mobile
```