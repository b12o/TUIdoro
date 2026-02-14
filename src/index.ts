import {
  Box,
  createCliRenderer,
  TextRenderable,
  StyledText,
  TextAttributes,
} from "@opentui/core";

import type { PomodoroSettings } from "./types.js";
import pomodoroSettings from "../settings.json";
import { Timer } from "./timer.js";

const settingsData: PomodoroSettings = pomodoroSettings;
const timer = new Timer(settingsData);
timer.start();

const renderer = await createCliRenderer({ exitOnCtrlC: true });

const timeText = new TextRenderable(renderer, {
  id: "timeleft",
  content: timer.timeLeftFormatted,
  justifyContent: "center",
  alignItems: "center",
});

renderer.root.add(
  Box(
    {
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
    },
    Box(
      {
        justifyContent: "center",
        alignItems: "flex-start",
      },
      timeText,
    ),
  ),
);

setInterval(() => {
  timeText.content = timer.timeLeftFormatted;
}, 1000);

renderer.start();

renderer.on("key", (event) => {
  if (event.key === "q") {
    renderer.destroy();
    process.exit();
  }
});
