import React from 'react';
import { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { formatDate } from '@openmrs/esm-framework';
import styles from './monthly-header.scss';

const LOCALE_MAP: Record<string, string> = {
  gregory: 'en-US',
  ethiopic: 'am-ET',
  islamic: 'ar-SA',
  persian: 'fa-IR',
};

interface MonthlyHeaderProps {
  calendarSelectedDate: Dayjs;
  calKey?: string;
  onSelectPrevMonth: () => void;
  onSelectNextMonth: () => void;
}

const MonthlyHeader: React.FC<MonthlyHeaderProps> = ({
  calendarSelectedDate,
  calKey = 'gregory',
  onSelectPrevMonth,
  onSelectNextMonth,
}) => {
  const { t } = useTranslation();
  const locale = LOCALE_MAP[calKey] ?? 'en-US';

  const dowLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(1970, 0, 4 + i); // Jan 4, 1970 = Sunday
    return new Intl.DateTimeFormat(locale, { weekday: 'short', calendar: calKey }).format(d);
  });

  return (
    <>
      <div className={styles.container}>
        <Button aria-label={t('previousMonth', 'Previous month')} kind="tertiary" onClick={onSelectPrevMonth} size="sm">
          {t('prev', 'Prev')}
        </Button>
        <span className={styles.monthTitle}>
          {formatDate(calendarSelectedDate.toDate(), { day: false, time: false, noToday: true })}
        </span>
        <Button aria-label={t('nextMonth', 'Next month')} kind="tertiary" onClick={onSelectNextMonth} size="sm">
          {t('next', 'Next')}
        </Button>
      </div>
      <div className={styles.workLoadCard}>
        {dowLabels.map((label, i) => (
          <div key={i} className={styles.dowCell}>
            {label}
          </div>
        ))}
      </div>
    </>
  );
};

export default MonthlyHeader;
