#!/usr/bin/env node

const {resolve} = require("path");
const fs = require("fs");
const {deploy} = require("../lib");
const {info, err} = require("../lib/utils/logger");

const curPath = resolve();
const inputPath = process.argv[2] || "deploy.config.js";
const configPath = resolve(curPath, inputPath);

info("lover-deploy-cli running...");

if (!fs.existsSync(configPath)) {
  err("missing config file");
  process.exit(1);
}

const config = require(configPath);

deploy(config);
