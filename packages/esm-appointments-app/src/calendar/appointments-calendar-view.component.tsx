import React, { useState, useCallback } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { getLocale } from '@openmrs/esm-framework';
import { useAppointmentsCalendar } from '../hooks/useAppointmentsCalendar';
import AppointmentsHeader from '../header/appointments-header.component';
import { useSelectedDate } from '../hooks/useSelectedDate';
import CalendarHeader, { type CalendarViewMode } from './header/calendar-header.component';
import MonthlyCalendarView from './monthly/monthly-calendar-view.component';

const REVERSE_LOCALE_MAP: Record<string, string> = {
  en: 'gregory',
  am: 'ethiopic',
  ar: 'islamic',
  fa: 'persian',
};

function deriveCalKey(): string {
  const locale = getLocale();
  const lang = locale?.split('-')[0] ?? 'en';
  return REVERSE_LOCALE_MAP[lang] ?? 'gregory';
}

const AppointmentsCalendarView: React.FC = () => {
  const { t } = useTranslation();
  const selectedDate = useSelectedDate();
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Dayjs>(dayjs(selectedDate));

  const calSysKey = deriveCalKey();
  const viewMode: CalendarViewMode = 'monthly';
  const period = 'monthly';

  const { calendarEvents } = useAppointmentsCalendar(calendarSelectedDate.toISOString(), period);

  const handlePrev = useCallback(() => {
    setCalendarSelectedDate((d) => d.subtract(1, 'month'));
  }, []);

  const handleNext = useCallback(() => {
    setCalendarSelectedDate((d) => d.add(1, 'month'));
  }, []);

  return (
    <div data-testid="appointments-calendar">
      <AppointmentsHeader title={t('calendar', 'Calendar')} />
      <CalendarHeader
        viewMode={viewMode}
        calendarSelectedDate={calendarSelectedDate}
        onViewModeChange={() => {}}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      <MonthlyCalendarView
        events={calendarEvents}
        calendarSelectedDate={calendarSelectedDate}
        calKey={calSysKey}
        setCalendarSelectedDate={setCalendarSelectedDate}
        onSelectDate={() => {}}
      />
    </div>
  );
};

export default AppointmentsCalendarView;
