const dayjs = require("dayjs");
const colors = require("colors/safe");

function publicLog(type, params) {
  const dateStr = `${colors.gray(dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"))}`;
  switch (type) {
    case "info": {
      console.info(`[${colors.cyan("INFO")}] ${dateStr}`, ...params);
      break;
    }
    case "warn": {
      console.warn(`[${colors.yellow("WARN")}] ${dateStr}`, ...params);
      break;
    }
    case "err": {
      console.error(`[${colors.red("ERROR")}] ${dateStr}`, ...params);
      break;
    }
  }
}

module.exports = {
  info(...rest) {
    publicLog("info", rest);
  },
  warn(...rest) {
    publicLog("warn", rest);
  },
  err(...rest) {
    publicLog("err", rest);
  }
};
