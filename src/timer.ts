import type { PomodoroSettings } from "./types.js";
import { logger } from "./logger.js";
import { countdownString } from "./utils.js";

export class Timer {
  // state
  isStarted = false;
  isRunning = false;
  isWork = false;
  isBreak = false;
  private intervalId: NodeJS.Timeout | undefined;

  // pomodoro settings
  workDurationSeconds = 1500; // 25 minutes
  shortBreakDurationSeconds = 300;
  longBreakDurationSeconds = 900;
  longBreakAfter = 4;
  lapsCompleted = 0;
  pauseAfterLap = true;
  currentTimeLeft = this.workDurationSeconds;

  // UI
  workCaption = "let's get to work.";
  shortBreakCaption = "time for a short break.";
  longBreakCaption = "time for a long break.";
  timeLeftFormatted = "";

  constructor(settingsData: PomodoroSettings) {
    this.workDurationSeconds = settingsData.workDuration;
    this.shortBreakDurationSeconds = settingsData.shortBreakDuration;
    this.longBreakDurationSeconds = settingsData.longBreakDuration;
    this.longBreakAfter = settingsData.longBreakAfter;
    this.timeLeftFormatted = countdownString(this.workDurationSeconds);

    // TODO: make sure that if a config is passed to the constructor, that the
    // durations are between 1-100
  }

  start() {
    logger.info("Initializing timer ...");
    this.isStarted = true;
    this.isRunning = true;
    this.isWork = true;
    this.currentTimeLeft = this.workDurationSeconds;
    this.intervalId = setInterval(() => this.countdown(), 1000);
  }

  stop(): void {
    logger.info("Stopping timer ...");
    this.isRunning = false;
    clearInterval(this.intervalId);
  }

  resume(): void {
    logger.info("Resuming timer ...");
    this.isRunning = true;
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.countdown(), 1000);
  }

  private countdown() {
    this.timeLeftFormatted = countdownString(this.currentTimeLeft--);
    if (this.currentTimeLeft < 0) {
      this.handleNextPeriod();
    }
  }

  handleNextPeriod() {
    this.stop();
    if (this.isWork) {
      this.lapsCompleted++;
      this.isWork = false;
      this.isBreak = true;
      this.currentTimeLeft = this.shortBreakDurationSeconds;
    } else if (this.isBreak) {
      this.isBreak = false;
      this.isWork = true;
      this.currentTimeLeft = this.workDurationSeconds;
    }
    // TODO: based on settings automatically resume or wait for user input
    // this.resume();
  }
}
