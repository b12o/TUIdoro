import {
  Box,
  createCliRenderer,
  TextRenderable,
  ASCIIFontRenderable,
} from "@opentui/core";

import type { PomodoroSettings } from "./types.js";
import pomodoroSettings from "../settings.json";
import { Timer } from "./timer.js";

const settingsData: PomodoroSettings = pomodoroSettings;
const timer = new Timer(settingsData);

const renderer = await createCliRenderer({ exitOnCtrlC: true });

const timeText = new ASCIIFontRenderable(renderer, {
  id: "timeleft",
  font: "block",
  text: timer.timeLeftFormatted,
  justifyContent: "center",
  alignItems: "center",
});

const laps = new TextRenderable(renderer, {
  id: "laps",
  content: `laps: ${timer.lapsCompleted}`,
  justifyContent: "center",
  alignItems: "center",
});

const captionText = new TextRenderable(renderer, {
  id: "caption",
  content: timer.workCaption,
  justifyContent: "center",
});

renderer.root.add(
  Box(
    {
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
      border: true,
    },
    Box(
      {
        justifyContent: "center",
      },
      captionText,
    ),
    Box(
      {
        justifyContent: "center",
        alignItems: "flex-start",
        border: true,
      },
      timeText,
    ),
    Box(
      {
        justifyContent: "center",
      },
      laps,
    ),
  ),
);

setInterval(() => {
  timeText.text = timer.timeLeftFormatted;
  laps.content = `laps: ${timer.lapsCompleted}`;
}, 100);

renderer.keyInput.on("keypress", (key) => {
  if (key.name === "q") {
    renderer.destroy();
    process.exit();
  }

  if (key.name === "s") {
    timer.start();
  }

  if (key.name === "r") {
    timer.resume();
  }
});
