import dayjs from "dayjs";
import {resolve} from "path";
import {NodeSSH} from "node-ssh";

import {compressedFile, connectServerBySSH, uploadFile, deleteFileByPath, executeShellCommand} from "./utils";
import {err} from "./utils/logger";
import {DeployConfigs} from "./model";

const ssh = new NodeSSH();
const curPath = resolve();
const curDateTimeStr = dayjs().format("YYYYMMDDHHmmss");

const curZipPath = resolve(curPath, `${curDateTimeStr}.zip`);

async function runScriptWithConfigs(configs) {
  const {scripts, path, name, isInServer = true} = configs;
  if (scripts) {
    await executeShellCommand(scripts, path, ssh);
  } else if (name) {
    if (isInServer) {
      await executeShellCommand(`sh ${name}`, path, ssh);
    } else {
      const uploadPath = resolve(curPath, name);
      await uploadFile(ssh, uploadPath, path, `${curDateTimeStr}.sh`);
      await executeShellCommand(`sh ${curDateTimeStr}.sh`, path, ssh);
      await executeShellCommand(`rm -rf ${curDateTimeStr}.sh`, path, ssh);
    }
  }
}

export async function deploy(configs: DeployConfigs) {
  const {
    filePath = "dist",
    server,
    serverPackage,
    scriptConfigs
  } = configs;
  if (!serverPackage || !serverPackage.path) {
    err("missing server package path");
    return;
  }
  try {
    await compressedFile(resolve(curPath, filePath), curZipPath, serverPackage.name);
    await connectServerBySSH(server, ssh);
    if (scriptConfigs && scriptConfigs.isBeforeUpload) {
      if (!scriptConfigs.path) {
        scriptConfigs.path = serverPackage.path;
      }
      await runScriptWithConfigs(scriptConfigs);
    }
    await uploadFile(ssh, curZipPath, serverPackage.path, "dist.zip");
    deleteFileByPath(curZipPath);
    if (serverPackage.isDeltaUpdate) {
      await executeShellCommand(`unzip -n dist.zip -d ./`, serverPackage.path, ssh);
    } else if (serverPackage.isBackup) {
      let cmdStr = `if [[ -d "${serverPackage.name}" ]]; then `;
      if (serverPackage.isBackup) {
        cmdStr = cmdStr + `mv "${serverPackage.name}" "${serverPackage.name}_${curDateTimeStr}"; fi`;
      } else {
        cmdStr = cmdStr + `rm -rf "${serverPackage.name}"; fi`;
      }
      await executeShellCommand(cmdStr, serverPackage.path, ssh);
      await executeShellCommand("unzip dist.zip -d ./", serverPackage.path, ssh);
    }
    await executeShellCommand(`rm -rf dist.zip`, serverPackage.path, ssh);
    if (scriptConfigs) {
      if (!scriptConfigs.path) {
        scriptConfigs.path = serverPackage.path;
      }
      await runScriptWithConfigs(scriptConfigs);
    }
  } catch (e) {
    deleteFileByPath(curZipPath);
    err(e);
  }
}
