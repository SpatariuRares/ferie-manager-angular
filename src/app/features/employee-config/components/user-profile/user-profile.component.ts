import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { TranslocoPipe } from '@ngneat/transloco';

import { UserConfigService } from '../../services/user-config.service';
import { UserProfile } from '../../../../core/models/user-profile.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    TranslocoPipe
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  totalAvailableHours = 0;
  totalAvailableDays = 0;
  availableCountries = ['IT', 'FR', 'US']; // Match with calendar options

  // Constants for conversion
  private readonly HOURS_PER_DAY = 8;

  constructor(
    private fb: FormBuilder,
    private userConfigService: UserConfigService
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.userConfigService.getUserProfile().subscribe(profile => {
      if (profile) {
        // Convert hours to days for display in the form
        this.profileForm.patchValue({
          name: profile.name,
          startedThisYear: profile.startedThisYear,
          country: profile.country,
          annualAllowanceDays: this.convertHoursToDays(profile.annualAllowanceHours),
          unusedPreviousYearHours: profile.unusedPreviousYearHours
        });
        this.calculateTotalAvailable();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      startedThisYear: [false],
      annualAllowanceDays: [26, [Validators.required, Validators.min(0)]], // Default to 26 days
      unusedPreviousYearHours: [0, [Validators.required, Validators.min(0)]],
      country: ['IT', Validators.required]
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;

      // Convert days to hours for storage
      const profile: UserProfile = {
        name: formValue.name,
        startedThisYear: formValue.startedThisYear,
        country: formValue.country,
        annualAllowanceHours: this.convertDaysToHours(formValue.annualAllowanceDays),
        unusedPreviousYearHours: formValue.unusedPreviousYearHours
      };

      this.userConfigService.saveUserProfile(profile);
      this.calculateTotalAvailable();
    }
  }

  private calculateTotalAvailable(): void {
    const formValue = this.profileForm.value;

    // Get the annual allowance and unused previous year days
    const annualAllowanceDays = formValue.annualAllowanceDays || 0;
    const unusedPreviousYearHours = this.convertHoursToDays(formValue.unusedPreviousYearHours || 0);

    // If started this year, prorate the annual allowance based on month
    let annualAllowanceToUse = annualAllowanceDays;
    if (formValue.startedThisYear) {
      const currentMonth = new Date().getMonth(); // 0-11
      annualAllowanceToUse = (annualAllowanceDays / 12) * (12 - currentMonth);
    }

    // Calculate total available days for the whole year
    this.totalAvailableDays = Math.round((annualAllowanceToUse + unusedPreviousYearHours) * 10) / 10;
    this.totalAvailableHours = this.convertDaysToHours(this.totalAvailableDays);
  }

  // Convert between days and hours, returning 0 for invalid values
  convertDaysToHours(days: number): number {
    if (days === null || days === undefined || isNaN(days)) {
      return 0;
    }
    return days * this.HOURS_PER_DAY;
  }

  convertHoursToDays(hours: number): number {
    if (hours === null || hours === undefined || isNaN(hours)) {
      return 0;
    }
    return Math.round((hours / this.HOURS_PER_DAY) * 10) / 10;
  }

  // Safe getters for form values to avoid NaN in the UI
  getAnnualAllowanceDays(): number {
    const days = this.profileForm.value.annualAllowanceDays;
    return days || 0;
  }

  getUnusedPreviousDays(): number {
    const days = this.profileForm.value.unusedPreviousYearHours;
    return days || 0;
  }
}