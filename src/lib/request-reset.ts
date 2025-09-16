/**
 * Utility functions for handling daily request resets
 */

/**
 * Get the start of today in UTC (midnight)
 */
export function getTodayMidnightUTC(): Date {
  const now = new Date();
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return midnight;
}

/**
 * Check if the requests should be reset based on the last reset date
 */
export function shouldResetRequests(lastResetAt: string): boolean {
  const lastReset = new Date(lastResetAt);
  const todayMidnight = getTodayMidnightUTC();
  return lastReset < todayMidnight;
}

/**
 * Get the effective free requests used, accounting for daily resets
 */
export function getEffectiveFreeRequestsUsed(profile: { free_requests_used: number; free_requests_reset_at: string }): number {
  if (shouldResetRequests(profile.free_requests_reset_at)) {
    return 0; // Reset to 0 if we should reset
  }
  return profile.free_requests_used;
}

/**
 * Get the next midnight UTC timestamp
 */
export function getNextMidnightUTC(): Date {
  const now = new Date();
  const nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return nextMidnight;
}
