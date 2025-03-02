import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
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
  private previousMonthsLength = 0;

  ngOnInit() {
    this.processMonths();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Quando months array cambia
    if (changes['months']) {
      // Salva l'indice corrente prima di processare i mesi
      const previousIndex = this.currentIndex;
      const isCompleteChange =
        !this.previousMonthsLength ||
        changes['months'].previousValue?.length !== changes['months'].currentValue?.length;

      this.processMonths();

      // Ripristina l'indice precedente solo se non è un cambio completo
      if (!isCompleteChange) {
        this.currentIndex = previousIndex;
      } else {
        // Se è un cambio completo (ad es. cambio paese), resetta a 0
        this.currentIndex = 0;
      }

      this.previousMonthsLength = this.months.length;
    }
  }



  previousMonths() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
   private processMonths() {
    // Clear existing pairs
    this.monthPairs = [];

    // Split months into pairs
    for (let i = 0; i < this.months.length; i += 2) {
      this.monthPairs.push(this.months.slice(i, i + 2));
    }

    // Calculate max index for pagination
    this.maxIndex = Math.max(0, this.months.length - 1);
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
