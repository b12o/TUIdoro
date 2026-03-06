import {
  type CliRenderer,
  ASCIIFontRenderable,
  TextRenderable,
  Text,
  Box,
} from "@opentui/core";

import { type InitialData } from "./types.js";

export function createLayout(renderer: CliRenderer, initialData: InitialData) {
  const timeText = new ASCIIFontRenderable(renderer, {
    id: "timeleft",
    font: "block",
    text: initialData.timeLeft,
    justifyContent: "center",
    alignItems: "center",
  });

  const pomodoriText = new TextRenderable(renderer, {
    id: "pomodori",
    content: `Pomodori: ${initialData.pomodori}`,
    justifyContent: "center",
    alignItems: "center",
  });

  const captionText = new TextRenderable(renderer, {
    id: "caption",
    content: initialData.caption,
    justifyContent: "center",
  });

  const separator = Text({
    content: "______________________________________",
  });

  const keyStart = Text({
    content: "s start",
  });

  const keyOptions = Text({
    content: "o options",
  });

  const keyZen = Text({
    content: "z zen",
  });

  const keyQuit = Text({
    content: "q quit",
  });

  const root = Box(
    {
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
    },
    Box(
      {
        justifyContent: "center",
        marginBottom: 1.5,
      },
      captionText,
    ),
    Box(
      {
        justifyContent: "center",
        alignItems: "flex-start",
      },
      timeText,
    ),
    Box(
      {
        justifyContent: "center",
        marginTop: 0.8,
      },
      pomodoriText,
    ),
    Box(
      {
        justifyContent: "center",
        marginTop: 1,
      },
      separator,
    ),
    Box(
      {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 40,
        marginTop: 1,
      },
      keyStart,
      keyOptions,
      keyZen,
      keyQuit,
    ),
  );
  return { root, timeText, pomodoriText, captionText };
}
