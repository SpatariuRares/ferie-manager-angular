export interface DayInfo {
  date: Date;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  isSelected: boolean;
  isBridge: boolean;
  isToday: boolean;
  isLeave: boolean;
  isDisabled: boolean;
}

export interface MonthData {
  name: string;
  shortName: string;
  number: number;
  days: DayInfo[];
}

export interface HolidayInfo {
  date: Date;
  name: string;
  type: string;
  countryCode: string;
}
 