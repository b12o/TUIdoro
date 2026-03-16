import type { PomodoroSettings, TimerState } from "./types.js";
import { logger } from "./logger.js";
import {
  countdownString,
  playSound,
  getSeconds,
  validateWorkInterval,
  validateBreakInterval,
  validateHex,
} from "./utils.js";

//@ts-ignore -- this is a bun-specific file embed import that ts is not aware of
import chime from "../assets/tuidoro_chime.mp3" with { type: "file" };

const OFF_WHITE = "#ccc";

export class Timer {
  // state
  isStarted = false; // is 'false' at the beginning and after every pomodoro
  isRunning = false;
  isWork = false;
  isBreak = false;
  intervalId: NodeJS.Timeout | undefined;

  // pomodoro settings
  workDurationSeconds = 1500; // 25 minutes
  shortBreakDurationSeconds = 300;
  longBreakDurationSeconds = 900;
  longBreakAfter = 4;
  lapsCompleted = 0;
  pauseAfterLap = true;
  currentTimeLeft = this.workDurationSeconds;
  enableSound = true;

  // UI
  caption = "Lock in.";
  workCaption = "Lock in.";
  shortBreakCaption = "Time for a short break.";
  longBreakCaption = "Time for a long break.";
  timeLeftFormatted = "";
  workColor = OFF_WHITE;
  shortBreakColor = OFF_WHITE;
  longBreakColor = OFF_WHITE;
  activeColor = OFF_WHITE;

  constructor(settingsData: PomodoroSettings) {
    this.validateInput(settingsData);

    this.currentTimeLeft = this.workDurationSeconds;
    this.timeLeftFormatted = countdownString(this.workDurationSeconds);
    this.activeColor = this.workColor;
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
  }

  private validateInput(settingsData: PomodoroSettings) {
    if (validateWorkInterval(settingsData.workDuration))
      this.workDurationSeconds = getSeconds(settingsData.workDuration);

    if (validateWorkInterval(settingsData.shortBreakDuration))
      this.shortBreakDurationSeconds = getSeconds(
        settingsData.shortBreakDuration,
      );

    if (validateWorkInterval(settingsData.longBreakDuration))
      this.longBreakDurationSeconds = getSeconds(
        settingsData.longBreakDuration,
      );

    if (validateBreakInterval(settingsData.longBreakAfter))
      this.longBreakAfter = settingsData.longBreakAfter;

    if (validateHex(settingsData.workColor))
      this.workColor = settingsData.workColor;

    if (validateHex(settingsData.shortBreakColor))
      this.shortBreakColor = settingsData.shortBreakColor;

    if (validateHex(settingsData.longBreakColor))
      this.longBreakColor = settingsData.longBreakColor;

    this.enableSound = settingsData.sound;
  }

  getState(): TimerState {
    if (!this.isStarted) return "IDLE";
    if (this.isRunning) return "RUNNING";
    else return "PAUSED";
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

  resume(msg: string = "Resuming ..."): void {
    logger.info(msg);
    this.isRunning = true;
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.countdown(), 1000);
  }

  private countdown() {
    this.currentTimeLeft--;
    this.timeLeftFormatted = countdownString(this.currentTimeLeft);
    if (this.currentTimeLeft <= 0) {
      this.handleNextPeriod();
    }
  }

  handleNextPeriod() {
    this.stop();
    this.isStarted = false;
    this.enableSound && playSound(chime);
    if (this.isWork) {
      this.lapsCompleted++;
      this.isWork = false;
      this.isBreak = true;
      if (this.lapsCompleted % this.longBreakAfter === 0) {
        this.activeColor = this.longBreakColor;
        this.currentTimeLeft = this.longBreakDurationSeconds;
        this.caption = this.longBreakCaption;
      } else {
        this.activeColor = this.shortBreakColor;
        this.currentTimeLeft = this.shortBreakDurationSeconds;
        this.caption = this.shortBreakCaption;
      }
      this.timeLeftFormatted = countdownString(this.currentTimeLeft);
    } else if (this.isBreak) {
      this.isBreak = false;
      this.isWork = true;
      this.activeColor = this.workColor;
      this.currentTimeLeft = this.workDurationSeconds;
      this.timeLeftFormatted = countdownString(this.currentTimeLeft);
      this.caption = this.workCaption;
    }
  }
}
