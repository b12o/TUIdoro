import { createCliRenderer, RGBA } from "@opentui/core";
import { logger } from "./logger.js";
import type { PomodoroSettings } from "./types.js";
import { Timer } from "./timer.js";
import { createLayout } from "./layout.js";
import { playSound } from "./utils.js";
import pomodoroSettings from "../settings.json";

const settingsData: PomodoroSettings = pomodoroSettings;
const timer = new Timer(settingsData);

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  onDestroy: cleanUp,
});

let zenModeEnabled = settingsData.zenMode ?? false;

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
zenModeEnabled ? hideElements() : showElements();

const mainLoop = setInterval(() => {
  timeText.text = timer.timeLeftFormatted;
  timeText.color = RGBA.fromHex(timer.activeColor);
  // 250ms in order to respond fairly quickly to timer.ts updates without
  // unnecessarily re-rendering UI
}, 250);

renderer.keyInput.on("keypress", (key) => {
  if (key.name === "q") {
    renderer.destroy();
  }

  if (key.name === "space") {
    playSound(process.env.TOGGLE_SOUND_PATH);
    if (!timer.isStarted) timer.start();
    else if (timer.isStarted && timer.isRunning) timer.stop();
    else if (timer.isStarted && !timer.isRunning) timer.resume();
    // show "resume/pause" in case zen mode is disabled
    zenModeEnabled ? hideElements() : showElements();
  }

  if (key.name === "z") {
    toggleZenMode();
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
  if (!timer.isStarted) {
    keyLifecycle.content = "space start";
  }
  if (timer.isStarted && timer.isRunning) {
    keyLifecycle.content = "space pause";
  }
  if (timer.isStarted && !timer.isRunning) {
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
