import { createCliRenderer } from "@opentui/core";
import type { PomodoroSettings } from "./types.js";
import { Timer } from "./timer.js";
import { createLayout } from "./layout.js";
import pomodoroSettings from "../settings.json";

const settingsData: PomodoroSettings = pomodoroSettings;
const timer = new Timer(settingsData);

const renderer = await createCliRenderer({ exitOnCtrlC: true });

const { root, timeText, pomodoriText, captionText } = createLayout(renderer, {
  timeLeft: timer.timeLeftFormatted,
  pomodori: timer.lapsCompleted,
  caption: timer.caption,
});

renderer.root.add(root);

setInterval(() => {
  timeText.text = timer.timeLeftFormatted;
  pomodoriText.content = `Pomodori: ${timer.lapsCompleted}`;
  captionText.content = timer.caption;
}, 200);
renderer.keyInput.on("keypress", (key) => {
  if (key.name === "q") {
    renderer.destroy();
    process.exit();
  }

  if (key.name === "s") {
    if (!timer.isStarted) timer.start();
  }

  if (key.name === "r") {
    if (timer.isStarted) timer.resume();
  }
});
