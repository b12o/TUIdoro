#!/usr/bin/env bun

import { createCliRenderer, RGBA } from "@opentui/core";
import { createLayout } from "./layout.js";
import { logger } from "./logger.js";
import { Timer } from "./timer.js";
import type { TimerState } from "./types.js";
import { loadConfig, playSound } from "./utils.js";

//@ts-ignore -- this is a bun-specific file embed import that ts is not aware of
import toggleSound from "../assets/tuidoro_toggle.mp3" with { type: "file" };

const config = loadConfig();
const timer = new Timer(config);

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  onDestroy: cleanUp,
});

let zenModeEnabled = config.zenMode ?? false;

const {
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
} = createLayout(renderer, {
  timeLeft: timer.timeLeftFormatted,
  pomodori: timer.lapsCompleted,
  caption: timer.caption,
});

renderer.root.add(root);

// initial render
timeText.color = RGBA.fromHex(timer.activeColor);
showHideElements();

// 250ms in order to respond fairly quickly to timer.ts updates without
// unnecessarily re-rendering UI
const RENDER_INTERVAL = 250;
const mainLoop = setInterval(() => {
  timeText.text = timer.timeLeftFormatted;
  timeText.color = RGBA.fromHex(timer.activeColor);
  captionText.content = timer.caption;
  pomodoriText.content = `Pomodori: ${timer.lapsCompleted}`;
  switch (timer.getState()) {
    case "IDLE":
      keyLifecycle.content = "space start";
      break;
    case "RUNNING":
      keyLifecycle.content = "space pause";
      break;
    case "PAUSED":
      keyLifecycle.content = "space resume";
  }
}, RENDER_INTERVAL);

const transition: Record<TimerState, () => void> = {
  IDLE: () => timer.start(),
  RUNNING: () => timer.stop(),
  PAUSED: () => timer.resume(),
};

timeContainer.onMouseUp = () => {
  config.sound && playSound(toggleSound);
  transition[timer.getState()]();
};

renderer.keyInput.on("keypress", (key) => {
  switch (key.name) {
    case "space": {
      // use block scope to prevent const hoisting shenanigans
      config.sound && playSound(toggleSound);
      transition[timer.getState()]();
      break;
    }
    case "r":
      config.sound && playSound(toggleSound);
      timer.reset();
      break;
    case "z":
      toggleZenMode();
      break;
    case "q":
      renderer.destroy();
      break;
  }
});

function toggleZenMode() {
  zenModeEnabled = !zenModeEnabled;
  showHideElements();
}

function cleanUp() {
  logger.info("Quitting ...");
  if (timer.intervalId) clearInterval(timer.intervalId);
  clearInterval(mainLoop);
  process.exit();
}

function showHideElements(): void {
  captionContainer.visible = !zenModeEnabled;
  pomodoriContainer.visible = !zenModeEnabled;
  separatorContainer.visible = !zenModeEnabled;
  optionsContainer.visible = !zenModeEnabled;
}
