// ---------------------------------------------------------------------------
// Carbon Tag type mapping — strict Carbon Design System
//
// Maps appointment status strings to the Carbon <Tag type="..."> prop values.
// See: https://carbondesignsystem.com/components/tag/usage/
//
// Colour semantics follow the Carbon status palette:
//   blue      → informational (Scheduled)
//   teal      → in progress   (CheckedIn)
//   green     → success       (Completed)
//   red       → error/danger  (Missed)
//   warm-gray → disabled      (Cancelled)
//   magenta   → warning-alt   (Requested)
// ---------------------------------------------------------------------------

export type CarbonTagType = 'blue' | 'cyan' | 'green' | 'gray' | 'magenta' | 'purple' | 'red' | 'teal' | 'warm-gray';

export const STATUS_TAG_TYPES: Readonly<Record<string, CarbonTagType>> = {
  Scheduled: 'blue',
  CheckedIn: 'teal',
  Completed: 'green',
  Missed: 'red',
  Cancelled: 'warm-gray',
  Requested: 'magenta',
} as const;

export const DEFAULT_STATUS_TAG_TYPE: CarbonTagType = 'gray';

// ---------------------------------------------------------------------------
// Service-color hashing — Carbon Design System tokens only
//
// Uses a curated set of Carbon CSS custom properties for categorical
// service-color accent borders.  Palette grade 60 tokens match the
// saturation level used by Carbon's own Tag component tokens
// (e.g. $tag-color-red, $tag-color-blue) while remaining
// semantically neutral — they do not imply error/success/warning state.
//
// $interactive → Blue 60 → "accent icons; selected elements"
//   (Carbon Miscellaneous token — ideal for the primary accent slot)
// ---------------------------------------------------------------------------

const SERVICE_COLOR_PALETTE: ReadonlyArray<string> = [
  'var(--cds-blue-60)',
  'var(--cds-purple-60)',
  'var(--cds-teal-60)',
  'var(--cds-magenta-60)',
  'var(--cds-cyan-60)',
  'var(--cds-green-60)',
  'var(--cds-orange-60)',
  'var(--cds-cool-gray-60)',
] as const;

/**
 * Deterministically map a service name to one of the palette entries.
 *
 * Uses a djb2-style hash so the same service always gets the same colour
 * within a session, without requiring a server lookup.
 */
export function getServiceColor(serviceName: string): string {
  let hash = 0;
  for (let i = 0; i < serviceName.length; i++) {
    hash = (hash << 5) - hash + serviceName.charCodeAt(i);
    hash |= 0;
  }
  return SERVICE_COLOR_PALETTE[Math.abs(hash) % SERVICE_COLOR_PALETTE.length];
}

// ---------------------------------------------------------------------------
// Hour utilities (used by daily view and modal)
// ---------------------------------------------------------------------------

export const CALENDAR_HOURS: ReadonlyArray<number> = Array.from({ length: 24 }, (_, i) => i) as ReadonlyArray<number>;

export function formatHourLabel(hour: number): string {
  const h = hour % 12 || 12;
  const period = hour < 12 ? 'AM' : 'PM';
  return `${h} ${period}`;
}

// ---------------------------------------------------------------------------
// Time-block utilities (used by weekly view — 4 six-hour blocks)
// ---------------------------------------------------------------------------

export interface TimeBlock {
  label: string;
  startHour: number;
  endHour: number; // exclusive
}

export const TIME_BLOCKS: ReadonlyArray<TimeBlock> = [
  { label: '12 AM – 6 AM', startHour: 0, endHour: 6 },
  { label: '6 AM – 12 PM', startHour: 6, endHour: 12 },
  { label: '12 PM – 6 PM', startHour: 12, endHour: 18 },
  { label: '6 PM – 12 AM', startHour: 18, endHour: 24 },
];

/**
 * Count appointments whose startDateTime falls within [startHour, endHour).
 * endHour is exclusive: an appointment at 12:00 PM belongs to the 12PM-6PM block.
 */
export function countInBlock(
  appointments: ReadonlyArray<{ startDateTime: number | string | null }>,
  startHour: number,
  endHour: number,
): number {
  let n = 0;
  for (const a of appointments) {
    if (a.startDateTime != null) {
      const h = new Date(a.startDateTime).getHours();
      if (h >= startHour && h < endHour) n += 1;
    }
  }
  return n;
}
