import { file } from "bun";
import { existsSync, readFileSync } from "fs";
import os from "os";
import path from "path";
import type { PomodoroSettings } from "./types.js";
import defaultSettings from "../config/settings.json";

const APP_NAME = "tuidoro";

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

export function getConfigPath() {
  let configPath = path.join(
    os.homedir(),
    ".config",
    APP_NAME,
    "settings.json",
  );
  const envPath = process.env.TUIDORO_SETTINGS_PATH;
  if (envPath && existsSync(envPath)) {
    configPath = envPath;
  }
  return configPath;
}

export function loadConfig(): PomodoroSettings {
  const rawInput = readFileSync(getConfigPath(), "utf8");
  return JSON.parse(rawInput);
}

export function loadDefaultConfig(): PomodoroSettings {
  return defaultSettings;
}
