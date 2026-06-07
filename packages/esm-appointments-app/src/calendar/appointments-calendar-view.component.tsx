import React, { useState, useCallback } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useAppointmentsCalendar } from '../hooks/useAppointmentsCalendar';
import AppointmentsHeader from '../header/appointments-header.component';
import { useSelectedDate } from '../hooks/useSelectedDate';
import CalendarHeader, { type CalendarViewMode } from './header/calendar-header.component';
import MonthlyCalendarView from './monthly/monthly-calendar-view.component';

const AppointmentsCalendarView: React.FC = () => {
  const { t } = useTranslation();
  const selectedDate = useSelectedDate();
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Dayjs>(dayjs(selectedDate));

  const calSysKey = 'gregory';
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
        calKey={calSysKey}
        calendarSelectedDate={calendarSelectedDate}
        onViewModeChange={() => {}}
        onCalendarSystemChange={() => {}}
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
