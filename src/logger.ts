import { appendFileSync } from "fs";

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

type Level = keyof typeof levels;
const currentLevel: Level = (process.env.LOG_LEVEL as Level) || "info";

function logToFile(msg: string) {
  // tuidoro is located in project root.
  appendFileSync("tuidoro.log", `${msg}\n`);
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
