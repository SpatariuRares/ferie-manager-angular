import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DayInfo, MonthData } from '../../../../core/models/calendar.models';
import { CalendarMonthComponent } from '../calendar-month/calendar-month.component';

@Component({
  selector: 'app-calendar-carousel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule,CalendarMonthComponent],
  templateUrl: './calendar-carousel.component.html',
  styleUrls: ['./calendar-carousel.component.scss']
})
export class CalendarCarouselComponent implements OnInit {
  @Input() months: MonthData[] = [];
  @Input() weekDays: DayInfo[] = [];
  @Output() daySelected = new EventEmitter<DayInfo>();

  monthPairs: MonthData[][] = [];
  currentIndex = 0;
  maxIndex = 0;

  ngOnInit() {
    // Dividi i mesi in coppie
    for (let i = 0; i < this.months.length; i += 2) {
      this.monthPairs.push(this.months.slice(i, i + 2));
    }
    this.maxIndex = Math.max(0, this.monthPairs.length - 1);
  }

  previousMonths() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextMonths() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    }
  }

  onDaySelected(day: DayInfo) {
    this.daySelected.emit(day);
  }
}
