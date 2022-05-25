## 一、概述

将本地目录上传至服务器

## 二、使用

### 1. 安装

``` shell
npm i -D lover-deploy-cli
```

### 2. 编写配置文件

在项目根路径创建配置文件，默认读取 `deploy.config.js` 文件，如果是其他文件名则在命令中传入路径即可

```js
// deploy.config.js

module.exports = {
  // 服务器连接方式采用 ssh
  server: {
    host: "localhost", // 服务器地址
    username: "", // 登录名
    password: "" // 登录密码
  },
  serverPackage: {
    path: "/root/pages", // 目录上传地址
    name: "home" // 服务器对应目录名
  }
};
```

上述配置作用：将本地名为 `dist` 的目录上传至服务器 `localhost` 中 `/root/pages` 上并命名为 `home`，如果之前 `/root/pages`目录中存在 `home` 目录，则之前的 `home`
目录被重命名为 `home_ + 时间`

### 3. 运行命令

```shell
lover-deploy-cli [config.name]
# 直接运行 lover-deploy-cli 会读取解析当前路径下的deploy.config.js
# 运行 lover-deploy-cli config.js 会读取解析当前路径下的 config.js
```

## 三、配置文件详情

```js
module.exports = {
  filePath: "", // 本地目录名 - 默认为 dist
  // 服务器相关配置
  server: {
    host: "localhost", // 服务器地址 - 必填
    username: "", // 登录名 - 必填
    password: "", // 登录密码
    privateKey: "" // ssh 私钥文件路径
    /* 注：密码和私钥不可同时为空 */
  },
  serverPackage: {
    path: "/root/pages", // 目录上传地址 - 必填
    name: "dist", // 服务器对应目录名 - 默认为 dist
    isBackup: true, // 是否开启备份 - 默认为 true
    isDeltaUpdate: false // 是否增量更新 - 默认为 false
    /* 
     * 注：增量更新使用场景为 webpack + content hash + 强缓存差量更新方式。
     *    在这种方式下会忽略备份，即使配置了需要备份也不会生效
     */
  },
  // 运行脚本相关配置
  scriptConfigs: {
    isInServer: true, // 脚本文件是否在服务器上 - 默认为 true
    isBeforeUpload: false, // 是否在上传前执行 - 默认为 false
    scripts: "ls ./", // 需要执行的脚本命令 - 此配置作用是直接在服务器运行此命令
    /* 注：在配置了需要执行的脚本命令的情况下，会忽略需要执行的脚本文件相关配置 */
    path: "", // 命令执行路径 - 默认为包上传目录路径(serverPackage.path)
    name: "" // 需要执行的脚本文件路径
    /* 
     * 注：如果 name 和 scripts 同时为空，则此项配置可以省略。
     * name 优先级低于 scripts。即配置了 scripts 后 name 配置不再生效
     */
  }
};
```

## 更新日志

#### v0.2.0

1. 新增 `ssh` 认证方式 - 通过读取私钥文件完成认证
2. 新增执行命令功能
3. 新增增量更新功能
