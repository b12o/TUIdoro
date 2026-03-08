import type { PomodoroSettings } from "./types.js";
import { logger } from "./logger.js";
import { countdownString } from "./utils.js";

export class Timer {
  // state
  isStarted = false; // is 'false' at the beginning and after every pomodoro
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
  caption = "";
  workCaption = "Lock in.";
  shortBreakCaption = "Time for a short break.";
  longBreakCaption = "Time for a long break.";
  timeLeftFormatted = "";

  constructor(settingsData: PomodoroSettings) {
    this.caption = this.workCaption;
    this.workDurationSeconds = settingsData.workDuration;
    this.currentTimeLeft = this.workDurationSeconds;
    this.shortBreakDurationSeconds = settingsData.shortBreakDuration;
    this.longBreakDurationSeconds = settingsData.longBreakDuration;
    this.longBreakAfter = settingsData.longBreakAfter;
    this.timeLeftFormatted = countdownString(this.workDurationSeconds);
    // should always start in work mode
    this.isWork = true;

    logger.debug("\n\n=================================\n");
    logger.debug("Initialized timer with following settings:");
    logger.debug(`workduration (seconds): ${this.workDurationSeconds}`);
    logger.debug(
      `short break duration (seconds): ${this.shortBreakDurationSeconds}`,
    );
    logger.debug(
      `long break duration (seconds): ${this.longBreakDurationSeconds}`,
    );
    logger.debug(`long break after (pomodori): ${this.longBreakAfter}`);

    // TODO: make sure that if a config is passed to the constructor, that the
    // durations are between 1-100
  }

  start(): void {
    this.isStarted = true;
    const period = this.isWork ? "new pomodoro" : "break";
    this.resume(`Starting ${period} ...`);
  }

  stop(): void {
    logger.info("Stopping ...");
    this.isRunning = false;
    clearInterval(this.intervalId);
  }

  resume(msg: string = "Resuming ...."): void {
    logger.info(msg);
    this.isRunning = true;
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.countdown(), 1000);
  }

  private countdown() {
    this.timeLeftFormatted = countdownString(--this.currentTimeLeft);
    if (this.currentTimeLeft < 0) {
      this.handleNextPeriod();
    }
  }

  handleNextPeriod() {
    this.stop();
    this.isStarted = false;
    if (this.isWork) {
      this.lapsCompleted++;
      this.isWork = false;
      this.isBreak = true;
      this.currentTimeLeft = this.shortBreakDurationSeconds;
      this.timeLeftFormatted = countdownString(this.currentTimeLeft);
      this.caption = this.shortBreakCaption;
    } else if (this.isBreak) {
      this.isBreak = false;
      this.isWork = true;
      this.currentTimeLeft = this.workDurationSeconds;
      this.timeLeftFormatted = countdownString(this.currentTimeLeft);
      this.caption = this.workCaption;
    }
    // TODO: based on settings automatically resume or wait for user input
    // this.resume();
  }
}
