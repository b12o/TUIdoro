import {
  type CliRenderer,
  ASCIIFontRenderable,
  TextRenderable,
  Box,
  RGBA,
} from "@opentui/core";

import { type InitialData } from "./types.js";

export function createLayout(renderer: CliRenderer, initialData: InitialData) {
  const offWhite = "#ccc";
  const gray = "#777";
  const timeText = new ASCIIFontRenderable(renderer, {
    id: "timeleft",
    font: "block",
    color: RGBA.fromHex(offWhite),
    text: initialData.timeLeft,
    justifyContent: "center",
    alignItems: "center",
  });

  const pomodoriText = new TextRenderable(renderer, {
    id: "pomodori",
    content: `Pomodori: ${initialData.pomodori}`,
    justifyContent: "center",
    alignItems: "center",
    fg: RGBA.fromHex(offWhite),
  });

  const captionText = new TextRenderable(renderer, {
    id: "caption",
    content: initialData.caption,
    justifyContent: "center",
    fg: RGBA.fromHex(offWhite),
  });

  const separator = new TextRenderable(renderer, {
    content: "______________________________________",
    fg: RGBA.fromHex(gray),
  });

  const keyLifecycle = new TextRenderable(renderer, {
    id: "lifecycle",
    content: "space start",
    fg: RGBA.fromHex(offWhite),
  });

  const keyZen = new TextRenderable(renderer, {
    content: "z zen",
    fg: RGBA.fromHex(offWhite),
  });

  const keyQuit = new TextRenderable(renderer, {
    content: "q quit",
    fg: RGBA.fromHex(offWhite),
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
      },
      captionText,
    ),
    Box(
      {
        justifyContent: "center",
        alignItems: "flex-start",
        marginTop: 1,
        marginBottom: 1,
      },
      timeText,
    ),
    Box(
      {
        justifyContent: "center",
      },
      pomodoriText,
    ),
    Box(
      {
        justifyContent: "center",
        marginTop: 1,
        marginBottom: 1,
      },
      separator,
    ),
    Box(
      {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 40,
      },
      keyLifecycle,
      keyZen,
      keyQuit,
    ),
  );

  return {
    root,
    timeText,
    pomodoriText,
    captionText,
    separator,
    keyLifecycle,
    keyZen,
    keyQuit,
  };
}
