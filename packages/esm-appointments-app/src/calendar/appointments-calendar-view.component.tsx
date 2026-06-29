import React, { useState, useCallback } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useAppointmentsCalendar } from '../hooks/useAppointmentsCalendar';
import AppointmentsHeader from '../header/appointments-header.component';
import { useSelectedDate } from '../hooks/useSelectedDate';
import CalendarHeader, { type CalendarViewMode } from './header/calendar-header.component';
import MonthlyCalendarView from './monthly/monthly-calendar-view.component';
import WeeklyCalendarView from './weekly/weekly-calendar-view.component';
import DailyCalendarView from './daily/daily-calendar-view.component';
import DayAppointmentsModal from './day-appointments-modal/day-appointments-modal.component';

const AppointmentsCalendarView: React.FC = () => {
  const { t } = useTranslation();
  const selectedDate = useSelectedDate();

  const [calSysKey, setCalSysKey] = useState('gregory');
  const [viewMode, setViewMode] = useState<CalendarViewMode>('monthly');
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Dayjs>(dayjs(selectedDate));
  const [modalIsoDate, setModalIsoDate] = useState<string | null>(null);

  const period = viewMode === 'weekly' ? 'weekly' : viewMode === 'daily' ? 'daily' : 'monthly';
  const { calendarEvents } = useAppointmentsCalendar(calendarSelectedDate.toISOString(), period);

  const handlePrev = useCallback(() => {
    if (viewMode === 'monthly') setCalendarSelectedDate((d) => d.subtract(1, 'month'));
    else if (viewMode === 'weekly') setCalendarSelectedDate((d) => d.subtract(7, 'day'));
    else setCalendarSelectedDate((d) => d.subtract(1, 'day'));
  }, [viewMode]);

  const handleNext = useCallback(() => {
    if (viewMode === 'monthly') setCalendarSelectedDate((d) => d.add(1, 'month'));
    else if (viewMode === 'weekly') setCalendarSelectedDate((d) => d.add(7, 'day'));
    else setCalendarSelectedDate((d) => d.add(1, 'day'));
  }, [viewMode]);

  const handleSelectDate = useCallback((isoDate: string) => setModalIsoDate(isoDate), []);

  const handleDrillDown = useCallback((_mode: 'daily', isoDate: string) => {
    setCalendarSelectedDate(dayjs(isoDate));
    setViewMode('daily');
    setModalIsoDate(null);
  }, []);

  const handleViewModeChange = useCallback((mode: CalendarViewMode) => {
    setViewMode(mode);
    setModalIsoDate(null);
  }, []);

  return (
    <div data-testid="appointments-calendar">
      <AppointmentsHeader title={t('calendar', 'Calendar')} />
      <CalendarHeader
        viewMode={viewMode}
        calKey={calSysKey}
        calendarSelectedDate={calendarSelectedDate}
        onViewModeChange={handleViewModeChange}
        onCalendarSystemChange={setCalSysKey}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      {viewMode === 'monthly' && (
        <MonthlyCalendarView
          events={calendarEvents}
          calendarSelectedDate={calendarSelectedDate}
          calKey={calSysKey}
          onSelectDate={handleSelectDate}
        />
      )}
      {viewMode === 'weekly' && (
        <WeeklyCalendarView
          calKey={calSysKey}
          calendarSelectedDate={calendarSelectedDate}
          onSelectDate={handleSelectDate}
        />
      )}
      {viewMode === 'daily' && <DailyCalendarView calKey={calSysKey} calendarSelectedDate={calendarSelectedDate} />}
      {modalIsoDate && (
        <DayAppointmentsModal
          isoDate={modalIsoDate}
          calKey={calSysKey}
          onClose={() => setModalIsoDate(null)}
          onDrillDown={handleDrillDown}
        />
      )}
    </div>
  );
};

export default AppointmentsCalendarView;
