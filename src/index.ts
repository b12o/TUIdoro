import { logger } from "./logger.js";
import { createCliRenderer, RGBA, StyledText } from "@opentui/core";
import type { PomodoroSettings } from "./types.js";
import { Timer } from "./timer.js";
import { createLayout } from "./layout.js";
import { playSound } from "./utils.js";
import pomodoroSettings from "../settings.json";

const settingsData: PomodoroSettings = pomodoroSettings;
const timer = new Timer(settingsData);
const renderer = await createCliRenderer({ exitOnCtrlC: true });

let zenModeEnabled = false;

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
}

setInterval(() => {
  timeText.text = timer.timeLeftFormatted;
  timeText.color = RGBA.fromHex(timer.activeColor);
  if (zenModeEnabled) {
    hideElements();
  } else {
    showElements();
  }
}, 250);

logger.info(`Zen mode enabled: ${zenModeEnabled}`);

renderer.keyInput.on("keypress", (key) => {
  if (key.name === "q") {
    logger.info("Quitting ...");
    if (timer.intervalId) clearInterval(timer.intervalId);
    renderer.destroy();
    process.exit();
  }

  if (key.name === "space") {
    playSound(process.env.TOGGLE_SOUND_PATH);
    if (!timer.isStarted) timer.start();
    else if (timer.isStarted && timer.isRunning) timer.stop();
    else if (timer.isStarted && !timer.isRunning) timer.resume();
  }

  if (key.name === "z") {
    logger.info(`Pressed zen mode toggle.`);
    toggleZenMode();
  }
});
