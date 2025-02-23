import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Holidays from 'date-holidays';
import { CalendarConfig, DEFAULT_CALENDAR_CONFIG } from '../config/calendar.config';
import { HolidayInfo } from '../../../core/models/calendar.models';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private holidays: Holidays;
  private configSubject = new BehaviorSubject<CalendarConfig>(DEFAULT_CALENDAR_CONFIG);

  config$: Observable<CalendarConfig> = this.configSubject.asObservable();

  constructor() {
    this.holidays = new Holidays();
    this.initializeHolidays(DEFAULT_CALENDAR_CONFIG);
  }

  setConfig(config: Partial<CalendarConfig>) {
    const newConfig = { ...this.configSubject.value, ...config };
    this.configSubject.next(newConfig);
    this.initializeHolidays(newConfig);
  }

  private initializeHolidays(config: CalendarConfig) {
    this.holidays = new Holidays(config.country);
    this.holidays.setLanguages([config.defaultLanguage, ...config.supportedLanguages]);
  }

  getHolidays(year: number): HolidayInfo[] {
    const config = this.configSubject.value;
    return this.holidays.getHolidays(year).map(holiday => ({
      date: new Date(holiday.date),
      name: holiday.name,
      type: holiday.type,
      countryCode: config.country
    }));
  }

  isHoliday(date: Date, holidays: HolidayInfo[]): boolean {
    return holidays.some(holiday => this.isSameDay(holiday.date, date));
  }

  getHolidayInfo(date: Date, holidays: HolidayInfo[]): HolidayInfo | null {
    return holidays.find(holiday => this.isSameDay(holiday.date, date)) || null;
  }

  isWorkingDay(date: Date): boolean {
    const config = this.configSubject.value;
    return config.workingDays.includes(date.getDay());
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}
