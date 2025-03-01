export interface UserProfile {
  id?: string;
  name: string;
  startedThisYear: boolean; // Simplified from full start date
  startDate?: Date; // Optional start date, used when startedThisYear is true
  annualAllowanceHours: number; // Number of vacation days per year
  usedLeave?: number; // Number of days already used
  unusedPreviousYearHours: number; // Days carried over from previous years
  country: string;
}