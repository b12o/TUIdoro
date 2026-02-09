import {
  ASCIIFont,
  Box,
  createCliRenderer,
  Text,
  TextAttributes,
} from "@opentui/core";

import pomodoroSettings from "../settings.json";

type PomodoroSettings = {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakAfter: number;
};

const settingsData: PomodoroSettings = pomodoroSettings;

const renderer = await createCliRenderer({ exitOnCtrlC: true });

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
        borderStyle: "double",
      },
      Text({
        id: "titleText",
        content: "Time to work.",
        attributes: TextAttributes.DIM,
      }),
      ASCIIFont({ font: "block", text: "5:00" }),
    ),
  ),
);
