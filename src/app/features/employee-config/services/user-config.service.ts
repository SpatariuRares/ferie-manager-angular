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
    this.browserStorageService.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    this.userProfile.next(profile);
  }

  private loadUserProfile(): void {
    const savedProfile = this.browserStorageService.getItem(this.STORAGE_KEY);
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        // Convert string date back to Date object
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

  calculateAccruedLeave(profile: UserProfile): number {
    if (!profile || !profile.startDate) {
      return 0;
    }

    const now = new Date();
    const startDate = new Date(profile.startDate);

    // Calculate months of employment
    const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 +
                      (now.getMonth() - startDate.getMonth());

    // Calculate years of employment (for Italian contracts typical calculation)
    const yearsOfEmployment = monthsDiff / 12;

    // Calculate accrued leave based on months worked and annual allowance
    // Assuming leave accrues linearly throughout the year
    const accrued = (profile.annualAllowance / 12) * monthsDiff;

    // Add carried over days
    return Math.round((accrued + (profile.carriedOver || 0)) * 10) / 10;
  }

  calculateRemainingLeave(profile: UserProfile): number {
    const accrued = this.calculateAccruedLeave(profile);
    return Math.round((accrued - (profile.usedLeave || 0)) * 10) / 10;
  }
}