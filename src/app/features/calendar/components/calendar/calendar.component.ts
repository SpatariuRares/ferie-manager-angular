// src/app/features/leave-manager/components/calendar/calendar.component.ts
import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoPipe } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

import { HolidayService } from '../../services/holiday.service';
import { CalendarService } from '../../services/calendar.service';
 import { CalendarConfig, COUNTRY_CONFIGS, DEFAULT_CALENDAR_CONFIG } from '../../config/calendar.config';
import { MonthData, HolidayInfo, DayInfo } from '../../../../core/models/calendar.models';
import { CalendarCarouselComponent } from '../calendar-carousel/calendar-carousel.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatListModule,
    MatSelectModule,
    TranslocoPipe,
    CalendarCarouselComponent
  ],
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],

})
export class CalendarComponent implements OnInit, OnDestroy {
  @Input() set config(value: Partial<CalendarConfig>) {
    this.updateConfig(value);
  }

  months: MonthData[] = [];
  weekDays: DayInfo[] = [];
  yearHolidays: HolidayInfo[] = [];
  currentYear = new Date().getFullYear();
  selectedYear = this.currentYear;
  selectedCountry = DEFAULT_CALENDAR_CONFIG.country;
  availableCountries = Object.keys(COUNTRY_CONFIGS);

  selectedDays: Date[] = [];
  workingDaysCount = 0;

  private selectedStart: Date | null = null;
  private selectedEnd: Date | null = null;
  private currentConfig: CalendarConfig = DEFAULT_CALENDAR_CONFIG;
  private destroy$ = new Subject<void>();

  constructor(
    private holidayService: HolidayService,
    private calendarService: CalendarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.holidayService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.currentConfig = config;
        this.initializeCalendar();
      });

    // In ngOnInit or constructor
    this.selectedCountry = this.currentConfig.country || DEFAULT_CALENDAR_CONFIG.country;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateConfig(config: Partial<CalendarConfig>) {
    const countryConfig = COUNTRY_CONFIGS[config.country || this.selectedCountry];
    const newConfig = { ...DEFAULT_CALENDAR_CONFIG, ...countryConfig, ...config };

    this.holidayService.setConfig(newConfig);
    this.selectedCountry = newConfig.country;

    // Aggiorna i giorni della settimana con la nuova configurazione
    this.weekDays = this.calendarService.getWeekDayNames(newConfig);

    // Forza il refresh dei mesi
    this.months = [];
    this.initializeCalendar();
  }

  onCountryChange() {
    this.updateConfig({ country: this.selectedCountry });
    this.initializeCalendar();
  }

  onYearChange() {
    this.initializeCalendar();
  }

  private initializeCalendar() {
    // Get holidays for the selected year based on current country
    this.yearHolidays = this.holidayService.getHolidays(this.selectedYear);

    // Create month data
    this.months = Array.from({ length: 12 }, (_, i) => {
      return {
        name: this.getMonthName(i),
        shortName: this.getMonthShortName(i),
        number: i,
        days: this.getDaysInMonth(this.selectedYear, i)
      };
    });

    // Update selections on the calendar
    this.updateMonthsData();

    // Force change detection
    this.cdr.detectChanges();

    console.log('Calendar initialized with country:', this.selectedCountry);
    console.log('Working days:', this.currentConfig.workingDays);
    console.log('Week starts on:', this.currentConfig.weekStartsOn);
  }

  private getDaysInMonth(year: number, month: number): DayInfo[] {
    const days: DayInfo[] = [];
    const date = new Date(year, month, 1);
    const today = new Date();

    while (date.getMonth() === month) {
      const holidayInfo = this.holidayService.getHolidayInfo(date, this.yearHolidays);
      const isWeekend = !this.holidayService.isWorkingDay(date);

      days.push({
        date: new Date(date),
        isWeekend: isWeekend,
        isHoliday: !!holidayInfo,
        holidayName: holidayInfo?.name,
        isSelected: false,
        isBridge: this.isBridgeDay(date),
        isToday: this.isSameDay(date, today),
        isLeave: false,
        isDisabled: date < today
      });

      date.setDate(date.getDate() + 1);
    }

    // Add empty days at the beginning for proper alignment based on weekStartsOn
    const firstDay = days[0].date.getDay();
    // Calculate padding based on the current config's weekStartsOn
    const weekStartsOn = this.currentConfig.weekStartsOn;
    // If week starts on Monday (1), we need padding if firstDay is > 1 or 0 (Sunday)
    // If week starts on Sunday (0), we need padding if firstDay > 0
    let paddingDays = 0;

    if (weekStartsOn === 1) {
      // For Monday start
      paddingDays = firstDay === 0 ? 6 : firstDay - 1;
    } else if (weekStartsOn === 0) {
      // For Sunday start
      paddingDays = firstDay;
    } else if (weekStartsOn === 6) {
      // For Saturday start
      paddingDays = (firstDay + 1) % 7;
    }

    for (let i = 0; i < paddingDays; i++) {
      days.unshift({} as DayInfo);
    }

    return days;
  }



  private getMonthName(monthIndex: number): string {
    return new Intl.DateTimeFormat(this.currentConfig.locale, { month: 'long' })
      .format(new Date(2024, monthIndex, 1));
  }

  private getMonthShortName(monthIndex: number): string {
    return new Intl.DateTimeFormat(this.currentConfig.locale, { month: 'short' })
      .format(new Date(2024, monthIndex, 1));
  }

  private updateMonthsData() {
    const today = new Date();

    this.months = this.months.map(month => ({
      ...month,
      days: month.days.map(day => {
        if (!day.date) return day;

        const holidayInfo = this.holidayService.getHolidayInfo(day.date, this.yearHolidays);
        const isWeekend = !this.holidayService.isWorkingDay(day.date);

        return {
          ...day,
          isWeekend,
          isHoliday: !!holidayInfo,
          holidayName: holidayInfo?.name,
          isSelected: this.isDateSelected(day.date),
          isBridge: this.isBridgeDay(day.date),
          isToday: this.isSameDay(day.date, today),
          // isDisabled: day.date < today || isWeekend || !!holidayInfo
          isDisabled: false
        };
      })
    }));
  }

  onDaySelected(day: DayInfo) {
    if (day.isDisabled) return;

    if (!this.selectedStart || (this.selectedStart && this.selectedEnd)) {
      this.selectedStart = day.date;
      this.selectedEnd = null;
    } else {
      if (day.date < this.selectedStart) {
        this.selectedStart = day.date;
      } else {
        this.selectedEnd = day.date;
      }
    }

    this.updateSelection();
  }

  private updateSelection() {
    if (!this.selectedStart) {
      this.selectedDays = [];
      this.workingDaysCount = 0;
    } else if (this.selectedStart && this.selectedEnd) {
      this.selectedDays = this.getDaysBetween(this.selectedStart, this.selectedEnd);
      this.workingDaysCount = this.calculateWorkingDays();
    } else {
      this.selectedDays = [this.selectedStart];
      this.workingDaysCount = this.holidayService.isWorkingDay(this.selectedStart) ? 1 : 0;
    }

    this.updateMonthsData();
  }

  private getDaysBetween(start: Date, end: Date): Date[] {
    const days: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  private calculateWorkingDays(): number {
    return this.selectedDays.filter(date =>
      this.holidayService.isWorkingDay(date) &&
      !this.holidayService.isHoliday(date, this.yearHolidays)
    ).length;
  }

  private isBridgeDay(date: Date): boolean {
    // 1. Deve essere un giorno lavorativo per essere un ponte
    if (!this.holidayService.isWorkingDay(date) ||
        this.holidayService.isHoliday(date, this.yearHolidays)) {
      return false;
    }

    // 2. Verifica se il giorno è tra due festività ravvicinate
    return this.isDateInBridgePeriod(date);
  }

  private isDateInBridgePeriod(date: Date): boolean {
    // Cerca la festività o weekend precedente più vicina
    const prevNonWorkingDay = this.findPreviousNonWorkingDay(date);

    // Cerca la festività o weekend successiva più vicina
    const nextNonWorkingDay = this.findNextNonWorkingDay(date);

    if (!prevNonWorkingDay || !nextNonWorkingDay) {
      return false;
    }

    // Calcola la distanza in giorni tra le due festività/weekend
    const daysBetween = Math.floor(
      (nextNonWorkingDay.getTime() - prevNonWorkingDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Se le festività sono abbastanza vicine (meno di 5 giorni lavorativi tra loro),
    // allora consideriamo tutti i giorni lavorativi tra loro come potenziali ponti
    return daysBetween <= 4; // Massimo 4-5 giorni lavorativi + la festività all'inizio e alla fine
  }

  private findPreviousNonWorkingDay(date: Date): Date | null {
    const maxDaysToLook = 10; // Limita la ricerca a un numero ragionevole di giorni
    const prevDay = new Date(date);

    for (let i = 1; i <= maxDaysToLook; i++) {
      prevDay.setDate(date.getDate() - i);

      if (!this.holidayService.isWorkingDay(prevDay) ||
          this.holidayService.isHoliday(prevDay, this.yearHolidays)) {
        return prevDay;
      }
    }

    return null;
  }

  private findNextNonWorkingDay(date: Date): Date | null {
    const maxDaysToLook = 10; // Limita la ricerca a un numero ragionevole di giorni
    const nextDay = new Date(date);

    for (let i = 1; i <= maxDaysToLook; i++) {
      nextDay.setDate(date.getDate() + i);

      if (!this.holidayService.isWorkingDay(nextDay) ||
          this.holidayService.isHoliday(nextDay, this.yearHolidays)) {
        return nextDay;
      }
    }

    return null;
  }

  private isDateSelected(date: Date): boolean {
    return this.selectedDays.some(selected => this.isSameDay(selected, date));
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  formatDate(date: Date): string {
    return this.calendarService.formatDate(date, this.currentConfig);
  }
}