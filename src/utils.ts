import fs from "fs";
import os from "os";
import path from "path";
import { file } from "bun";
import type { PomodoroSettings } from "./types.js";

const APP_NAME = process.env.APP_NAME ?? "tuidoro";

export function countdownString(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = remainingSeconds.toString().padStart(2, "0");
  return `${minutesStr}:${secondsStr}`;
}

export async function playSound(audio: string) {
  const tmpId = Math.random().toString(36).slice(2);
  const playPath = path.join(os.tmpdir(), `${APP_NAME}_${tmpId}.mp3`);
  await Bun.write(playPath, await file(audio).bytes());
  const proc = Bun.spawn(["paplay", playPath]);
  await proc.exited;
  await Bun.file(playPath).unlink();
}

export function getSeconds(minute: number) {
  return minute * 60;
}

export function validateWorkInterval(time: number) {
  return Number.isInteger(time) && time > 0 && time < 60;
}

export function validateBreakInterval(interval: number): boolean {
  return Number.isInteger(interval) && interval > 0 && interval < 60;
}

export function validateHex(hex: string) {
  // Validates: # followed by 3 or 6 hex characters
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

export function loadConfig(): PomodoroSettings {
  const configPath = path.join(
    os.homedir(),
    ".config",
    APP_NAME,
    "settings.json",
  );
  try {
    const rawInput = fs.readFileSync(configPath, "utf8");
    const settingsData: PomodoroSettings = JSON.parse(rawInput);
    return settingsData;
  } catch {
    console.error("Please fix your settings file first.");
    process.exit(1);
  }
}
