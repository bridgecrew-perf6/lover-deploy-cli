import fs from "fs";
import path from "path";
import archiver from "archiver";
import {info, err} from "./logger";

/**
 * @description: 文件压缩
 * @author: lover
 */
export function compressedFile(filePath: string, zipName: string, targetName: string | null | undefined) {
  return new Promise<void>((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`${filePath} is not existed`));
      return;
    }
    if (!zipName) {
      zipName = `${filePath}.zip`;
    }
    if (!targetName) {
      targetName = "dist";
    }
    info(`compressing ${filePath} to ${zipName}.zip`);
    const file = fs.createWriteStream(zipName);
    const archive = archiver("zip", {zlib: {level: 9}});
    archive.pipe(file);
    archive.directory(filePath, targetName, null);
    archive.finalize().then(() => {
      info(`compressed ${filePath} finished`);
    });
    file.on("close", () => {
      info(`compressed ${filePath} succeed`);
      resolve();
    }).on("error", e => {
      err(`compressed ${filePath} failed`);
      reject(e);
    });
  });
}

/**
 * @description: 连接远程服务器
 * @author: lover
 */
export function connectServerBySSH(config, ssh) {
  return new Promise<void>((resolve, reject) => {
    if (!config || !config.host || !config.username) {
      reject(new Error("missing server config"));
      return;
    }
    if (!ssh || typeof ssh.connect !== "function") {
      reject(new Error("missing NodeSSH instance"));
      return;
    }
    const server = {...config};
    if (!server.port) {
      server.port = 22;
    }
    info(`connecting ${server.host}@${server.username}`);
    ssh.connect(server).then(() => {
      info(`connected ${server.host}@${server.username} succeed`);
      resolve();
    }).catch(e => {
      err(`connected ${server.host}@${server.username} failed`);
      reject(e);
    });
  });
}

/**
 * @description: 上传文件
 * @author: lover
 */
export function uploadFile(ssh, distPath, targetPath, packageName) {
  return new Promise<void>((resolve, reject) => {
    if (!fs.existsSync(distPath)) {
      reject(new Error(`${distPath} is not existed`));
      return;
    }
    if (!ssh || typeof ssh.connect !== "function") {
      reject(new Error("missing NodeSSH instance"));
      return;
    }
    if (!targetPath) {
      reject(new Error("missing target path"));
      return;
    }
    if (!packageName) {
      packageName = "";
    }
    info(`uploading ${distPath} to ${targetPath}`);
    ssh.putFile(distPath, path.join(targetPath, packageName)).then(() => {
      info(`uploaded ${distPath} succeed`);
      resolve();
    }).catch(e => {
      err(`uploaded ${distPath} failed`);
      reject(e);
    });
  });
}


/**
 * @description: 删除文件
 * @author: lover
 */
export function deleteFileByPath(path) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    info(`delete ${path} succeed`);
    return;
  }
  err(`${path} is not exists`);
}

/**
 * @description: 执行 sh 命令
 * @author: lover
 */
export function executeShellCommand(command, path, ssh) {
  return new Promise<void>((resolve, reject) => {
    if (!command) {
      reject(new Error("command is empty"));
      return;
    }
    if (!ssh || typeof ssh.connect !== "function") {
      reject(new Error("missing NodeSSH instance"));
      return;
    }
    if (!path) {
      path = "/";
    }
    info(`executing ${command} in ${path}`);
    ssh.execCommand(command, {cwd: path}).then(r => {
      if (r.stderr) {
        err(`executed ${command} in ${path} failed`);
        reject(r);
      }
      err(`executed ${command} in ${path} succeed`);
      resolve();
    }).catch(e => {
      err(`executed ${command} in ${path} failed`);
      reject(e);
    });
  });
}
