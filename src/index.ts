import path from "path";
import os from "os";
import fs from "fs";
import { createCliRenderer, RGBA } from "@opentui/core";
import { logger } from "./logger.js";
import type { PomodoroSettings, TimerState } from "./types.js";
import { Timer } from "./timer.js";
import { createLayout } from "./layout.js";
import { playSound } from "./utils.js";

//@ts-ignore -- this is a bun-specific file embed import that ts is not aware of
import toggleSound from "../assets/tuidoro_toggle.mp3" with { type: "file" };

export const APP_NAME = "tuidoro";

export function loadConfig(path: string): PomodoroSettings {
  try {
    const rawInput = fs.readFileSync(path, "utf8");
    const settingsData: PomodoroSettings = JSON.parse(rawInput);
    return settingsData;
  } catch {
    console.log("Please fix your settings file first.");
    process.exit(1);
  }
}

const configPath = path.join(
  os.homedir(),
  ".config",
  APP_NAME,
  "settings.json",
);
const config = loadConfig(configPath);
const timer = new Timer(config);

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  onDestroy: cleanUp,
});

let zenModeEnabled = config.zenMode ?? false;

const {
  root,
  captionContainer,
  captionText,
  timeText,
  pomodoriContainer,
  pomodoriText,
  separatorContainer,
  optionsContainer,
  keyLifecycle,
} = createLayout(renderer, {
  timeLeft: timer.timeLeftFormatted,
  pomodori: timer.lapsCompleted,
  caption: timer.caption,
});

renderer.root.add(root);

// initial render
timeText.color = RGBA.fromHex(timer.activeColor);
showHideElements();

// 250ms in order to respond fairly quickly to timer.ts updates without
// unnecessarily re-rendering UI
const RENDER_INTERVAL = 250;
const mainLoop = setInterval(() => {
  timeText.text = timer.timeLeftFormatted;
  timeText.color = RGBA.fromHex(timer.activeColor);
  captionText.content = timer.caption;
  pomodoriText.content = `Pomodori: ${timer.lapsCompleted}`;
  switch (timer.getState()) {
    case "IDLE":
      keyLifecycle.content = "space start";
      break;
    case "RUNNING":
      keyLifecycle.content = "space pause";
      break;
    case "PAUSED":
      keyLifecycle.content = "space resume";
  }
}, RENDER_INTERVAL);

const transition: Record<TimerState, () => void> = {
  IDLE: () => timer.start(),
  RUNNING: () => timer.stop(),
  PAUSED: () => timer.resume(),
};

renderer.keyInput.on("keypress", (key) => {
  switch (key.name) {
    case "q":
      renderer.destroy();
      break;
    case "z":
      toggleZenMode();
      break;
    case "space": {
      // use block scope to prevent const hoisting shenanigans
      playSound(toggleSound);
      const timerState = timer.getState();
      transition[timerState]();
      break;
    }
  }
});

function toggleZenMode() {
  zenModeEnabled = !zenModeEnabled;
  showHideElements();
}

function cleanUp() {
  logger.info("Quitting ...");
  if (timer.intervalId) clearInterval(timer.intervalId);
  clearInterval(mainLoop);
  process.exit();
}

function showHideElements(): void {
  captionContainer.visible = !zenModeEnabled;
  pomodoriContainer.visible = !zenModeEnabled;
  separatorContainer.visible = !zenModeEnabled;
  optionsContainer.visible = !zenModeEnabled;
}
