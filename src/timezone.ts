const CHICAGO_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Chicago',
  dateStyle: 'medium',
  timeStyle: 'short',
});

// The backend stores and sends every timestamp as UTC (per graph-ad-reporter's
// SQLite schema); this is the only place that timezone conversion happens,
// and only for human-facing display -- never for comparisons.
export function formatAsChicagoTime(utcIsoTimestamp: string): string {
  return CHICAGO_FORMATTER.format(new Date(utcIsoTimestamp));
}
