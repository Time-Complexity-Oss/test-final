import React from 'react';
import styles from './monthly-header.scss';

const LOCALE_MAP: Record<string, string> = {
  gregory: 'en-US',
  ethiopic: 'am-ET',
  islamic: 'ar-SA',
  persian: 'fa-IR',
};

const CALENDAR_OPTIONS: Array<{ key: string; label: string }> = [
  { key: 'gregory', label: 'Gregorian' },
  { key: 'ethiopic', label: 'Ethiopic' },
  { key: 'islamic', label: 'Islamic (Civil)' },
  { key: 'persian', label: 'Persian (Solar Hijri)' },
];

interface MonthlyHeaderProps {
  calKey?: string;
}

const MonthlyHeader: React.FC<MonthlyHeaderProps> = ({ calKey = 'gregory' }) => {
  const locale = LOCALE_MAP[calKey] ?? 'en-US';

  // Use Intl.DateTimeFormat directly — no stored DOW label arrays
  const dayNames = Array.from({ length: 7 }, (_, i) => {
    // Jan 4, 1970 is a Sunday — add i days to get Mon, Tue, etc.
    const d = new Date(1970, 0, 4 + i);
    return new Intl.DateTimeFormat(locale, { weekday: 'short', calendar: calKey }).format(d);
  });

  return (
    <div className={styles.workLoadCard}>
      {dayNames.map((label, i) => (
        <div key={i} className={styles.dowCell}>
          {label}
        </div>
      ))}
    </div>
  );
};

export default MonthlyHeader;

export { LOCALE_MAP, CALENDAR_OPTIONS };
