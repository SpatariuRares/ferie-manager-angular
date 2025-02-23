import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';
import { DayInfo, MonthData } from '../../../../core/models/calendar.models';

@Component({
  selector: 'app-calendar-month',
  standalone: true,
  imports: [CommonModule, MatCardModule, CalendarDayComponent],
  templateUrl: `./calendar-month.component.html`,
  styleUrls: [`./calendar-month.component.scss`],
})
export class CalendarMonthComponent {
  @Input() monthData!: MonthData;
  @Input() weekDays: DayInfo[] = [];
  @Output() daySelected = new EventEmitter<DayInfo>();

  onDaySelected(day: DayInfo): void {
    this.daySelected.emit(day);
  }
}
