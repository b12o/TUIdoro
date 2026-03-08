import { logger } from "./logger.js";
import { createCliRenderer } from "@opentui/core";
import type { PomodoroSettings } from "./types.js";
import { Timer } from "./timer.js";
import { createLayout } from "./layout.js";
import pomodoroSettings from "../settings.json";

const settingsData: PomodoroSettings = pomodoroSettings;
const timer = new Timer(settingsData);

const renderer = await createCliRenderer({ exitOnCtrlC: true });

const { root, timeText, pomodoriText, captionText, keyLifecycle } =
  createLayout(renderer, {
    timeLeft: timer.timeLeftFormatted,
    pomodori: timer.lapsCompleted,
    caption: timer.caption,
  });

renderer.root.add(root);

setInterval(() => {
  timeText.text = timer.timeLeftFormatted;
  pomodoriText.content = `Pomodori: ${timer.lapsCompleted}`;
  captionText.content = timer.caption;
  if (!timer.isStarted) {
    keyLifecycle.content = "s start";
  }
  if (timer.isStarted && timer.isRunning) {
    keyLifecycle.content = "p pause";
  }
  if (timer.isStarted && !timer.isRunning) {
    keyLifecycle.content = "r resume";
  }
}, 250);

renderer.keyInput.on("keypress", (key) => {
  if (key.name === "q") {
    logger.info("Quitting ...");
    renderer.destroy();
    process.exit();
  }

  if (key.name === "s") {
    if (!timer.isStarted) timer.start();
  }

  if (key.name === "p") {
    if (timer.isStarted && timer.isRunning) timer.stop();
  }

  if (key.name === "r") {
    if (timer.isStarted && !timer.isRunning) timer.resume();
  }
});
