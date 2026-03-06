export type PomodoroSettings = {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakAfter: number;
  workColor: string;
  shortBreakColor: string;
  longBreakColor: string;
};

export type InitialData = {
  timeLeft: string;
  pomodori: number;
  caption: string;
};
