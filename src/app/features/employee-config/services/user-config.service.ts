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

    const currentMonth = new Date().getMonth(); // 0-11
    const totalMonths = 12;

    // Ensure we have valid numbers
    const annualAllowance = profile.annualAllowanceHours || 0;
    const unusedHours = profile.unusedPreviousYearHours || 0;

    // If the employee started this year, prorate the annual allowance
    let accrued = 0;

    if (profile.startedThisYear) {
      // Calculate hours accrued based on the current month (assuming linear accrual)
      // If we're in June (month 5), they've accrued (5+1)/12 of their annual allowance
      accrued = (annualAllowance / totalMonths) * (currentMonth + 1);
    } else {
      // If they didn't start this year, calculate based on which month we're in
      // (assuming they accrue leave progressively throughout the year)
      accrued = (annualAllowance / totalMonths) * (currentMonth + 1);
    }

    // Add unused hours from previous years
    return Math.round((accrued + unusedHours) * 10) / 10;
  }

  calculateRemainingHours(profile: UserProfile): number {
    return this.calculateAccruedHours(profile);
  }
}