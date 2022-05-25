## 一、概述

### 主要功能

将配置指定的本地目录上传至服务器指定位置

### 应用场景

在 nginx 或其他配置已配置好的情况下，将前端代码包自动上传部署

## 二、使用

### 1. 安装

``` shell
npm i -D lover-deploy-cli
```

### 2. 编写配置文件

在项目根路径创建配置文件，默认读取 `deploy.config.js` 文件，如果是其他文件名则在命令中传参传入相对路径即可

```js
// deploy.config.js

module.exports = {
  filePath: "dist", // 需要上传的文件路径（相对路径） - 不传默认为 dist
  // 服务器连接方式采用 ssh
  server: {
    host: "localhost", // 服务器地址 - 必传
    port: 22, // 连接端口号 - 不传默认为 22
    username: "", // 登录名 - 必传
    password: "" // 登录密码 - 必传
  },
  serverPackage: {
    path: "/root/pages", // 目录上传地址 - 必传
    name: "home", // 服务器对应目录名 - 不传默认为 dist
    isBackup: true // 是否开启包备份 - 不传默认为 true
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

## 更新日志

#### v0.2.0

新增 `ssh` 认证方式 - 通过读取私钥文件完成认证
