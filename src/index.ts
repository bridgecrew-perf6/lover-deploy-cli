import {resolve} from "path";
import dayjs from "dayjs";
import {NodeSSH} from "node-ssh";

import {compressedFile, connectServerBySSH} from "./utils";
import {err} from "./utils/logger";
import {DeployConfigs} from "./model";

const ssh = new NodeSSH();
const curPath = resolve();
const curDateTimeStr = dayjs().format("YYYYMMDDHHmmss");

export async function deploy(configs: DeployConfigs) {
  const {
    filePath = "dist",
    server,
    serverPackage
  } = configs;

  if (!serverPackage || !serverPackage.path) {
    err("missing server package path");
    return;
  }
  try {
    await compressedFile(resolve(curPath, filePath), `${curDateTimeStr}.zip`, serverPackage.name);
    await connectServerBySSH(server, ssh);
  } catch (e) {
    err(e);
  }
}
