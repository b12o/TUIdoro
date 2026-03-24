import {
  type CliRenderer,
  ASCIIFontRenderable,
  Box,
  BoxRenderable,
  RGBA,
  TextRenderable,
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
    selectable: false,
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
    content: "_________________________________________",
    fg: RGBA.fromHex(gray),
  });

  const keyLifecycle = new TextRenderable(renderer, {
    id: "lifecycle",
    content: "space start",
    fg: RGBA.fromHex(offWhite),
  });

  const keyZen = new TextRenderable(renderer, {
    id: "keyZen",
    content: "z zen",
    fg: RGBA.fromHex(offWhite),
  });

  const keyReset = new TextRenderable(renderer, {
    id: "keyReset",
    content: "r reset",
    fg: RGBA.fromHex(offWhite),
  });

  const keyQuit = new TextRenderable(renderer, {
    id: "keyQuit",
    content: "q quit",
    fg: RGBA.fromHex(offWhite),
  });

  const captionContainer = new BoxRenderable(renderer, {
    id: "captionContainer",
    alignItems: "center",
  });
  captionContainer.add(captionText);

  const timeContainer = new BoxRenderable(renderer, {
    id: "timeContainer",
    alignItems: "flex-start",
    marginTop: 1,
    marginBottom: 1,
  });
  timeContainer.add(timeText);

  const pomodoriContainer = new BoxRenderable(renderer, {
    id: "pomodoriContainer",
    alignItems: "center",
  });
  pomodoriContainer.add(pomodoriText);

  const separatorContainer = new BoxRenderable(renderer, {
    id: "separatorContainer",
    alignItems: "center",
    marginTop: 1,
    marginBottom: 1,
    width: 42,
  });
  separatorContainer.add(separator);

  const optionsContainer = new BoxRenderable(renderer, {
    id: "optionsContainer",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 42,
  });
  optionsContainer.add(keyLifecycle);
  optionsContainer.add(keyReset);
  optionsContainer.add(keyZen);
  optionsContainer.add(keyQuit);

  const root = Box(
    {
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
    },
    Box(
      {
        width: 45,
        alignItems: "center",
        justifyContent: "center",
      },
      captionContainer,
      timeContainer,
      pomodoriContainer,
      separatorContainer,
      optionsContainer,
    ),
  );

  return {
    root,
    captionContainer,
    captionText,
    timeContainer,
    timeText,
    pomodoriContainer,
    pomodoriText,
    separatorContainer,
    optionsContainer,
    keyLifecycle,
  };
}
