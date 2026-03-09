import {
  type CliRenderer,
  ASCIIFontRenderable,
  TextRenderable,
  Box,
  RGBA,
} from "@opentui/core";

import { type InitialData } from "./types.js";

export function createLayout(renderer: CliRenderer, initialData: InitialData) {
  const timeText = new ASCIIFontRenderable(renderer, {
    id: "timeleft",
    font: "block",
    color: RGBA.fromHex("#ccc"),
    text: initialData.timeLeft,
    justifyContent: "center",
    alignItems: "center",
  });

  const pomodoriText = new TextRenderable(renderer, {
    id: "pomodori",
    content: `Pomodori: ${initialData.pomodori}`,
    justifyContent: "center",
    alignItems: "center",
    fg: RGBA.fromHex("#ccc"),
  });

  const captionText = new TextRenderable(renderer, {
    id: "caption",
    content: initialData.caption,
    justifyContent: "center",
    fg: RGBA.fromHex("#ccc"),
  });

  const separator = new TextRenderable(renderer, {
    content: "______________________________________",
    fg: RGBA.fromHex("#777"),
  });

  const keyLifecycle = new TextRenderable(renderer, {
    id: "lifecycle",
    content: "space start",
    fg: RGBA.fromHex("#ccc"),
  });

  const keyZen = new TextRenderable(renderer, {
    content: "z zen",
    fg: RGBA.fromHex("#ccc"),
  });

  const keyQuit = new TextRenderable(renderer, {
    content: "q quit",
    fg: RGBA.fromHex("#ccc"),
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
        border: true,
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
