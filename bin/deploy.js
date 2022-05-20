#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const deploy = require("../lib");
const logger = require("../lib/logger");

logger.info("start deploy");

const inputPath = process.argv[2] || "deploy.config.js";
const configPath = path.join(process.cwd(), inputPath);

const isConfigFileExists = fs.existsSync(configPath);

if (!isConfigFileExists) {
  logger.err("missing config file");
  process.exit(1);
}

const config = require(configPath);

deploy(config);
