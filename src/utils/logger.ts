/**
 * @description: 日志打印
 * @author: lover
 */
import dayjs from "dayjs";
import colors from "colors/safe";

function publicPrint(type: string, params) {
  const dateStr = `${colors.gray(dayjs().format("YYYY-MM-DD hh:mm:ss"))}`;
  switch (type) {
    case "info": {
      console.info(`[${colors.cyan("INFO")}] ${dateStr}`, ...params);
      break;
    }
    case "err": {
      console.error(`[${colors.red("ERROR")}] ${dateStr}`, ...params);
      break;
    }
  }
}

export function info(...rest) {
  publicPrint("info", rest);
}

export function err(...rest) {
  publicPrint("err", rest);
}

