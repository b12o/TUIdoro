import { appendFileSync } from "fs";
import os from "os";
import path from "path";

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

type Level = keyof typeof levels;
const currentLevel: Level = (process.env.TUIDORO_LOG_LEVEL as Level) || "info";

function logToFile(msg: string) {
  const logPath = path.join(os.tmpdir(), "tuidoro.log");
  appendFileSync(logPath, `${msg}\n`);
}

export const logger = {
  debug: (msg: string) =>
    levels[currentLevel] <= levels.debug && logToFile(`[DEBUG] ${msg}`),
  info: (msg: string) =>
    levels[currentLevel] <= levels.info && logToFile(`[INFO] ${msg}`),
  warn: (msg: string) =>
    levels[currentLevel] <= levels.warn && logToFile(`[WARN] ${msg}`),
  error: (msg: string) =>
    levels[currentLevel] <= levels.error && logToFile(`[ERROR] ${msg}`),
};
