import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../../../core/models/user-profile.model';
import { BrowserStorageService } from '../../../core/services/browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  private userProfile = new BehaviorSubject<UserProfile | null>(null);
  private readonly STORAGE_KEY = 'userProfile';

  constructor(private browserStorageService: BrowserStorageService) {
    this.loadUserProfile();
  }

  getUserProfile(): Observable<UserProfile | null> {
    return this.userProfile.asObservable();
  }

  saveUserProfile(profile: UserProfile): void {
    // Ensure we have valid numbers
    profile.annualAllowanceHours = profile.annualAllowanceHours || 0;
    profile.unusedPreviousYearHours = profile.unusedPreviousYearHours || 0;

    this.browserStorageService.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    this.userProfile.next(profile);
  }

  private loadUserProfile(): void {
    const savedProfile = this.browserStorageService.getItem(this.STORAGE_KEY);
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);

        // Ensure we have valid numbers
        profile.annualAllowanceHours = profile.annualAllowanceHours || 0;
        profile.unusedPreviousYearHours = profile.unusedPreviousYearHours || 0;

        // Convert string dates back to Date objects
        if (profile.startDate) {
          profile.startDate = new Date(profile.startDate);
        }

        this.userProfile.next(profile);
      } catch (e) {
        console.error('Error parsing user profile', e);
        this.userProfile.next(null);
      }
    }
  }

  calculateAccruedHours(profile: UserProfile): number {
    if (!profile) {
      return 0;
    }

    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const totalMonths = 12;

    // Ensure we have valid numbers
    const annualAllowance = profile.annualAllowanceHours || 0;
    const unusedHours = profile.unusedPreviousYearHours || 0;

    // If the employee started this year, prorate the annual allowance
    let accrued = 0;

    if (profile.startedThisYear) {
      if (profile.startDate) {
        // Calculate months between start date and now
        const startDate = new Date(profile.startDate);
        const monthsWorked = (now.getFullYear() - startDate.getFullYear()) * 12 +
                           (now.getMonth() - startDate.getMonth());

        // Calculate hours accrued based on months worked
        accrued = (annualAllowance / totalMonths) * Math.max(0, monthsWorked);
      } else {
        // If no start date is provided, fall back to current month calculation
        accrued = (annualAllowance / totalMonths) * (currentMonth + 1);
      }
    } else {
      // If they didn't start this year, they get the full annual allowance
      accrued = annualAllowance;
    }

    // Add unused hours from previous years
    return Math.round((accrued + unusedHours) * 10) / 10;
  }

  // Calculate total available hours for the year (full annual allowance or prorated + unused)
  calculateTotalAvailableHours(profile: UserProfile): number {
    if (!profile) {
      return 0;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const annualAllowance = profile.annualAllowanceHours || 0;
    const unusedHours = profile.unusedPreviousYearHours || 0;

    let availableAllowance = annualAllowance;

    if (profile.startedThisYear && profile.startDate) {
      const startDate = new Date(profile.startDate);

      // If start date is in current year, prorate allowance
      if (startDate.getFullYear() === currentYear) {
        const monthsInYear = 12;
        const monthsWorking = monthsInYear - startDate.getMonth();
        availableAllowance = (annualAllowance / monthsInYear) * monthsWorking;
      }
    }

    return Math.round((availableAllowance + unusedHours) * 10) / 10;
  }
}