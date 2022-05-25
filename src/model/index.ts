export interface ServerConfigs {
  host: string,
  port?: number,
  username: string,
  password?: string,
  privateKey?: string
}

export interface ServerPackageConfigs {
  path: string,
  name?: string,
  isBackup?: boolean,
  isDeltaUpdate?: boolean,
  isNodeProject?: boolean,
  runNodePackage?: string
}

export interface ScriptConfigs {
  isInServer?: boolean,
  isBeforeUpload?: boolean,
  scripts?: string,
  path?: string,
  name?: string
}

export interface DeployConfigs {
  filePath: string,
  server: ServerConfigs,
  serverPackage: ServerPackageConfigs,
  scriptConfigs?: ScriptConfigs
}
