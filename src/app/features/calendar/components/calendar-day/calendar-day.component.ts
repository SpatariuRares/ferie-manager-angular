import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DayInfo } from '../../../../core/models/calendar.models';

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss']
})
export class CalendarDayComponent {
  @Input() day!: DayInfo;
  @Output() daySelected = new EventEmitter<DayInfo>();

  getDayClass(): string {
    let classes = [];

    if (this.day.isWeekend) classes.push('day-weekend');
    if (this.day.isHoliday) classes.push('day-holiday');
    if (this.day.isSelected) classes.push('day-selected');
    if (this.day.isBridge) classes.push('day-bridge');
    if (this.day.isToday) classes.push('day-today');
    if (this.day.isLeave) classes.push('day-leave');
    if (this.day.isDisabled) classes.push('day-disabled');
    if (!this.day.isDisabled && !this.day.isWeekend && !this.day.isHoliday) {
      classes.push('day-normal');
    }

    return classes.join(' ');
  }

  getTooltip(): string {
    const parts = [];
    if (this.day.holidayName) parts.push(this.day.holidayName);
    if (this.day.isBridge) parts.push('Potential Bridge Day');
    if (this.day.isLeave) parts.push('Already Booked');
    return parts.join(' - ') || 'Working Day';
  }

  onDayClick(): void {
    this.daySelected.emit(this.day);
  }
}

