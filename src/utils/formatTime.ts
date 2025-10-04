/**
 * Format time in seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "3:24", "12:05")
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
