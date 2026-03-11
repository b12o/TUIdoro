import fs from "node:fs";
import { createCliRenderer, RGBA } from "@opentui/core";
import { logger } from "./logger.js";
import type { PomodoroSettings, TimerState } from "./types.js";
import { Timer } from "./timer.js";
import { createLayout } from "./layout.js";
import { playSound } from "./utils.js";

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
const config = loadConfig(process.env.SETTINGS_FILE!);
const timer = new Timer(config);

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  onDestroy: cleanUp,
});

let zenModeEnabled = config.zenMode ?? false;

const {
  root,
  timeText,
  pomodoriText,
  captionText,
  separator,
  keyLifecycle,
  keyZen,
  keyQuit,
} = createLayout(renderer, {
  timeLeft: timer.timeLeftFormatted,
  pomodori: timer.lapsCompleted,
  caption: timer.caption,
});

renderer.root.add(root);

// initial render
timeText.color = RGBA.fromHex(timer.activeColor);
zenModeEnabled ? hideElements() : showElements();

// 250ms in order to respond fairly quickly to timer.ts updates without
// unnecessarily re-rendering UI
const RENDER_INTERVAL = 250;
const mainLoop = setInterval(() => {
  timeText.text = timer.timeLeftFormatted;
  timeText.color = RGBA.fromHex(timer.activeColor);
  // update elements that might change automatically based on timer state.
  if (!zenModeEnabled) {
    captionText.content = timer.caption;
    pomodoriText.content = `Pomodori: ${timer.lapsCompleted}`;
    if (timer.getState() === "IDLE") keyLifecycle.content = "space start";
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
      playSound(process.env.TOGGLE_SOUND_PATH);
      const timerState = timer.getState();
      transition[timerState]();
      zenModeEnabled ? hideElements() : showElements();
    }
  }
});

function hideElements() {
  captionText.content = "";
  pomodoriText.content = "";
  separator.content = "";
  keyLifecycle.content = "";
  keyZen.content = "";
  keyQuit.content = "";
  timeText.marginTop = 4;
}

function showElements() {
  captionText.content = timer.caption;
  pomodoriText.content = `Pomodori: ${timer.lapsCompleted}`;
  keyZen.content = "z zen";
  keyQuit.content = "q quit";
  separator.content = "______________________________________";
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
  timeText.marginTop = 1;
}

function toggleZenMode() {
  zenModeEnabled = !zenModeEnabled;
  const status = zenModeEnabled ? "Enabled" : "Disabled";
  logger.info(`${status} zen mode.`);
  zenModeEnabled ? hideElements() : showElements();
}

function cleanUp() {
  logger.info("Quitting ...");
  if (timer.intervalId) clearInterval(timer.intervalId);
  clearInterval(mainLoop);
  process.exit();
}
