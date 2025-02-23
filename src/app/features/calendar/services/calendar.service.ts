import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { CalendarConfig } from '../config/calendar.config';
import { MonthData, DayInfo  } from '../../../core/models/calendar.models';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  getMonthData(year: number, monthIndex: number, config: CalendarConfig): MonthData {
    const date = new Date(year, monthIndex, 1);
    const formatter = new Intl.DateTimeFormat(config.locale, { month: 'long' });
    const shortFormatter = new Intl.DateTimeFormat(config.locale, { month: 'short' });

    return {
      name: formatter.format(date),
      shortName: shortFormatter.format(date),
      number: monthIndex,
      days: this.getDaysInMonth(year, monthIndex)
    };
  }

  getWeekDayNames(config: CalendarConfig): DayInfo[] {
    const days: DayInfo[] = [];
    const formatter = new Intl.DateTimeFormat(config.locale, { weekday: 'short' });

    // Usiamo una data fissa (1 gennaio 2024 è un lunedì)
    const startDate = new Date(2024, 0, 1); // 1 gennaio 2024

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayOfWeek = date.getDay();

      days.push({
        date: date,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isHoliday: false,
        isSelected: false,
        isBridge: false,
        isToday: false,
        isLeave: false,
        isDisabled: false
      });
    }

    // Se config.weekStartsOn non è 1 (lunedì), rotare l'array
    if (config.weekStartsOn !== 1) {
      const rotate = (config.weekStartsOn === 0) ? 6 : config.weekStartsOn - 1;
      for (let i = 0; i < rotate; i++) {
        days.unshift(days.pop()!);
      }
    }

    return days;
  }


  formatDate(date: Date, config: CalendarConfig): string {
    return format(date, config.dateFormat);
  }

  private getDaysInMonth(year: number, month: number): DayInfo[] {
    const days: DayInfo[] = [];
    const date = new Date(year, month, 1);

    while (date.getMonth() === month) {
      days.push({
        date: new Date(date),
        isWeekend: false,
        isHoliday: false,
        isSelected: false,
        isBridge: false,
        isToday: false,
        isLeave: false,
        isDisabled: false
      });
      date.setDate(date.getDate() + 1);
    }

    return this.padMonth(days);
  }

  private padMonth(days: DayInfo[]): DayInfo[] {
    const firstDay = days[0].date.getDay();
    const padding = [];
    for (let i = firstDay === 0 ? 6 : firstDay - 1; i > 0; i--) {
      padding.push({} as DayInfo);
    }
    return [...padding, ...days];
  }
}

