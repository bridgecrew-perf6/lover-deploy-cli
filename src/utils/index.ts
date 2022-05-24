import fs from "fs";
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
    if (!targetName) {
      targetName = "dist";
    }
    info(`compressing ${filePath}`);
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
