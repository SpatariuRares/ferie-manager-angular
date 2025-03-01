export interface UserProfile {
  id?: string;
  name: string;
  startDate: Date;
  annualAllowance: number; // Number of vacation days per year
  usedLeave: number; // Number of days already used
  carriedOver: number; // Days carried over from previous years
  email?: string;
  preferredLanguage: string;
}