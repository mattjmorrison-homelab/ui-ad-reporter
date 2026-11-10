import { describe, expect, it } from 'vitest';
import { formatAsChicagoTime } from './timezone';

describe('formatAsChicagoTime', () => {
  it('converts a UTC timestamp to America/Chicago for display (CST, UTC-6)', () => {
    // 2026-01-15T18:30:00Z -> 12:30 PM CST
    expect(formatAsChicagoTime('2026-01-15T18:30:00Z')).toBe('Jan 15, 2026, 12:30 PM');
  });

  it('accounts for daylight saving time (CDT, UTC-5)', () => {
    // 2026-07-15T18:30:00Z -> 1:30 PM CDT
    expect(formatAsChicagoTime('2026-07-15T18:30:00Z')).toBe('Jul 15, 2026, 1:30 PM');
  });

  it('rolls over to the previous day when the UTC time is early morning', () => {
    // 2026-01-01T02:00:00Z -> 2025-12-31T20:00 CST
    expect(formatAsChicagoTime('2026-01-01T02:00:00Z')).toBe('Dec 31, 2025, 8:00 PM');
  });
});
