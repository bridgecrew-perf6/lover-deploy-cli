const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const dayjs = require("dayjs");
const {NodeSSH} = require("node-ssh");
const logger = require("./logger");

const ssh = new NodeSSH();
const curPath = process.cwd();
const localZipFilePath = path.join(curPath, "dist.zip");

async function deploy(config) {
  const {
    file = "dist",
    server = {},
    serverPackage = {}
  } = config;
  if (!server.host || !server.username) {
    logger.err("missing server config");
    process.exit(1);
  }
  if (!server.privateKey && !server.password) {
    logger.err("missing server certification methods");
    process.exit(1);
  }
  if (!serverPackage.path) {
    logger.err("missing server package config");
    process.exit(1);
  }
  // 没有传入端口号 默认 22
  if (!server.port) {
    server.port = 22;
  }
  // 没有传入包名 默认 dist
  if (!serverPackage.name) {
    serverPackage.name = "dist";
  }
  // 默认 开启备份
  if ([undefined, null].includes(serverPackage.isBackup)) {
    serverPackage.isBackup = true;
  }
  const filePath = path.join(curPath, file);
  try {
    // 1. 压缩本地文件
    await compressedFile(filePath, serverPackage.name);
    // 2. 连接远程服务器
    await connectServerBySSH(server, ssh);
    // 3. 上传文件至远程服务器
    await uploadFile(serverPackage.path, localZipFilePath);
    // 4. 删除本地文件
    deleteFileByPath(localZipFilePath);
    // 5. 判断是否需要备份
    let cmdStr = `if [[ -d "${serverPackage.name}" ]]; then `;
    if (serverPackage.isBackup) {
      cmdStr = cmdStr + `mv "${serverPackage.name}" "${serverPackage.name}_${dayjs(new Date()).format("YYYYMMDDHHmmss")}"; fi`;
    } else {
      cmdStr = cmdStr + `rm -rf "${serverPackage.name}"; fi`;
    }
    await executeShellCommand(cmdStr, serverPackage.path);
    await executeShellCommand("unzip -d ./ dist.zip", serverPackage.path);
    await executeShellCommand("rm -rf dist.zip", serverPackage.path);
    process.exit(0);
  } catch (e) {
    logger.err(e);
    process.exit(1);
  }
}

/**
 * @description: 上传文件
 * @author: lover
 */
function uploadFile(uploadPath, distPath) {
  return new Promise((resolve, reject) => {
    logger.info("start upload file");
    ssh.putFile(distPath, path.join(uploadPath, "/dist.zip")).then(() => {
      logger.info("uploaded successful");
      resolve();
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * @description: 删除文件
 * @author: lover
 */
function deleteFileByPath(path) {
  fs.unlinkSync(path);
}

/**
 * @description: 执行 sh 命令
 * @author: lover
 */
export function executeShellCommand(command, path) {
  return new Promise((resolve, reject) => {
    logger.info("start execute shell command: ", command);
    ssh.execCommand(command, {cwd: path}).then(r => {
      if (r.stderr) {
        reject(r);
      }
      resolve();
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports = deploy;
