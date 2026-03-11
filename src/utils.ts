import { exec } from "child_process";
import { promisify } from "util";
import { logger } from "./logger.js";

/**
 * Creates a string representation of the countdown.
 * @param seconds - amount of seconds to display as countdown string
 * @example 342 => "05:42"
 */
export function countdownString(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = remainingSeconds.toString().padStart(2, "0");
  return `${minutesStr}:${secondsStr}`;
}

/**
 * Plays a sound (paplay)
 * @param path - path to audio file
 * @example playSound('foo.mp3') -> executes "paplay foo.mp3"
 */
export async function playSound(path: string | undefined) {
  if (!path) return;
  const execPromise = promisify(exec);
  try {
    await execPromise(`paplay ${path}`);
  } catch (error) {
    logger.error(`Unable to play ${path}: ${error}`);
  }
}

export function getSeconds(minute: number) {
  return minute * 60;
}

export function validateTime(time: number) {
  return Number.isInteger(time) && time > 0 && time < 60;
}

export function validateInterval(interval: number): boolean {
  return Number.isInteger(interval) && interval > 0 && interval < 99;
}

export function validateHex(hex: string) {
  // Validates: # followed by 3 or 6 hex characters
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}
