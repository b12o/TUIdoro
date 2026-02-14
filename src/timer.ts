import { logger } from "./logger.js";
import { countdownString } from "./utils.js";

export class Timer {
  // state
  isStarted = false;
  isRunning = false;
  isWork = false;
  isBreak = false;
  lapsCompleted: number = 0;

  // pomodoro settings
  workDurationMinutes = 25;
  shortBreakDurationMinutes = 5;
  longBreakDurationMinutes = 15;
  longBreakAfter = 6;
  pauseAfterLap = true;

  // counter settings
  workDurationSeconds = this.workDurationMinutes * 60;
  shortBreakDurationSeconds = this.shortBreakDurationMinutes * 60;
  longBreakDurationSeconds = this.longBreakDurationMinutes * 60;
  currentTimeLeft = this.workDurationSeconds;

  // counters
  private intervalId: NodeJS.Timeout | undefined;

  // UI
  workCaption = "let's get to work";
  shortBreakCaption = "time for a short break";
  longBreakCaption = "time for a long break";

  constructor(workDuration?: number, breakDuration?: number) {
    if (workDuration) this.workDurationSeconds = workDuration;
    if (breakDuration) this.shortBreakDurationSeconds = breakDuration;

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
    this.intervalId = setInterval(() => this.countdown(), 1000);
  }

  private countdown() {
    console.log(countdownString(this.currentTimeLeft--));
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
    this.resume();
  }
}
