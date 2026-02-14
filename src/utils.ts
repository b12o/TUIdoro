/**
 * Creates a string representation of the countdown.
 * @param seconds - amount of seconds to display as countdown string
 * @example 342 => "05:42"
 */
export function countdownString(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = remainingSeconds.toString().padStart(2, "0");
  return `${minutesStr}:${secondsStr}`;
}
