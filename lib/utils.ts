type ClassValue = string | false | null | undefined;

/** Join conditional class names. Avoid conflicting utilities at the call site. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const DEFAULT_FRAME_RATE = 30;
const TIMECODE_DIGITS = 2;

/** Convert seconds to non-drop-frame HH:MM:SS:FF (30 fps by default). */
export function formatTimecode(seconds: number, fps = DEFAULT_FRAME_RATE): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new RangeError("Seconds must be a finite, non-negative number.");
  }
  if (!Number.isInteger(fps) || fps <= 0) {
    throw new RangeError("Frame rate must be a positive integer.");
  }

  const totalFrames = Math.floor(seconds * fps);
  const totalSeconds = Math.floor(totalFrames / fps);
  const hours = Math.floor(totalSeconds / (SECONDS_PER_MINUTE * MINUTES_PER_HOUR));
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE) % MINUTES_PER_HOUR;
  const remainingSeconds = totalSeconds % SECONDS_PER_MINUTE;
  const frames = totalFrames % fps;

  return [hours, minutes, remainingSeconds, frames]
    .map((value) => String(value).padStart(TIMECODE_DIGITS, "0"))
    .join(":");
}
