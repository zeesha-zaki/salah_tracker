// Pure calculation helpers (no UI) - easy to test and debug.
import { PRAYERS } from './storage';

// A day is "checked" if the user logged at least one prayer OR marked it exempt.
const isChecked = (day) => day.exempt || PRAYERS.some((p) => day.prayers[p.key]);

/**
 * days: array of day objects (only past/today days in the chosen range).
 * Formula:  denominator = daysChecked * 5 - exemptPrayers
 * Exempt days add 5 to exemptPrayers, so they cancel out and NEVER count as missed.
 * "Missed %" = whatever is left over (explicit misses + prayers not logged on a checked day).
 */
export function computeStats(days) {
  let checked = 0, exempt = 0, prayed = 0, delayed = 0, missed = 0;
  for (const day of days) {
    if (!isChecked(day)) continue;
    checked++;
    if (day.exempt) { exempt += 5; continue; } // skip entirely
    for (const p of PRAYERS) {
      const s = day.prayers[p.key];
      if (s === 'prayed') prayed++;
      else if (s === 'delayed') delayed++;
      else if (s === 'missed') missed++;
    }
  }
  const denom = checked * 5 - exempt;
  const pct = (n) => (denom > 0 ? Math.round((n / denom) * 100) : 0);
  const onTimePct = pct(prayed);
  const delayedPct = pct(delayed);
  const missedPct = denom > 0 ? Math.max(0, 100 - onTimePct - delayedPct) : 0;
  return { checked, exempt, prayed, delayed, missed, denom, onTimePct, delayedPct, missedPct,
           totalPct: pct(prayed + delayed) };
}

/**
 * Streak = consecutive days (newest -> oldest) where all 5 prayers were prayed/delayed.
 * Exempt days are skipped (don't add, don't break). An unfinished "today" doesn't break it.
 * `daysNewestFirst`: array of day objects, index 0 = today.
 */
export function computeStreak(daysNewestFirst) {
  let streak = 0;
  for (let i = 0; i < daysNewestFirst.length; i++) {
    const day = daysNewestFirst[i];
    if (day.exempt) continue;
    const done = PRAYERS.every((p) => ['prayed', 'delayed'].includes(day.prayers[p.key]));
    if (done) streak++;
    else if (i === 0) continue; // today still in progress
    else break;
  }
  return streak;
}
