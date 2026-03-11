export type PomodoroSettings = {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakAfter: number;
  workColor: string;
  shortBreakColor: string;
  longBreakColor: string;
  zenMode: boolean;
};

export type InitialData = {
  timeLeft: string;
  pomodori: number;
  caption: string;
};

export type TimerState = "IDLE" | "RUNNING" | "PAUSED";
