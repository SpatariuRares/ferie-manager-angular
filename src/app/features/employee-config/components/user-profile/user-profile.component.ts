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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserConfigService } from '../../services/user-config.service';
import { UserProfile } from '../../../../core/models/user-profile.model';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';

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
    MatNativeDateModule,
    TranslocoPipe,
    MatDatepickerModule,
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
    private userConfigService: UserConfigService,
    private router: Router // Inject Router
  ) {
    this.profileForm = this.createForm();
    this.setupStartDateValidation();

  }

  ngOnInit(): void {
    this.userConfigService.getUserProfile().subscribe(profile => {
      if (profile) {
        // Convert hours to days for display in the form
        this.profileForm.patchValue({
          name: profile.name,
          startedThisYear: profile.startedThisYear,
          startDate: profile.startDate ? new Date(profile.startDate) : null,
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
      startDate: [null],
      annualAllowanceDays: [26, [Validators.required, Validators.min(0)]], // Default to 26 days
      unusedPreviousYearHours: [0, [Validators.required, Validators.min(0)]],
      country: ['IT', Validators.required]
    });
  }

  private setupStartDateValidation(): void {
    // Make startDate required when startedThisYear is checked
    this.profileForm.get('startedThisYear')?.valueChanges.subscribe(startedThisYear => {
      const startDateControl = this.profileForm.get('startDate');

      if (startedThisYear) {
        startDateControl?.setValidators([Validators.required]);

        // Set default date to January 1st of current year if not already set
        if (!startDateControl?.value) {
          const currentYear = new Date().getFullYear();
          startDateControl?.setValue(new Date(currentYear, 0, 1)); // January 1st
        }
      } else {
        startDateControl?.clearValidators();
        startDateControl?.setValue(null);
      }

      startDateControl?.updateValueAndValidity();
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;

      // Convert days to hours for storage
      const profile: UserProfile = {
        name: formValue.name,
        startedThisYear: formValue.startedThisYear,
        startDate: formValue.startedThisYear ? formValue.startDate : undefined,
        country: formValue.country,
        annualAllowanceHours: this.convertDaysToHours(formValue.annualAllowanceDays),
        unusedPreviousYearHours: formValue.unusedPreviousYearHours
      };

      this.userConfigService.saveUserProfile(profile);
      this.calculateTotalAvailable();

      this.router.navigate(['/calendar']);
    }
  }

  private calculateTotalAvailable(): void {
    const formValue = this.profileForm.value;

    // Get the annual allowance and unused previous year days
    const annualAllowanceDays = formValue.annualAllowanceDays || 0;
    const unusedPreviousYearHours = this.convertHoursToDays(formValue.unusedPreviousYearHours || 0);

    // If started this year, prorate the annual allowance based on month
    let annualAllowanceToUse = annualAllowanceDays;

    if (formValue.startedThisYear && formValue.startDate) {
      const now = new Date();
      const startDate = new Date(formValue.startDate);
      const currentYear = now.getFullYear();

      // Ensure we're working with dates in the current year
      if (startDate.getFullYear() === currentYear) {
        // Calculate months between start date and end of year
        const monthsWorking = 12 - startDate.getMonth();
        // Prorate annual allowance based on months working
        annualAllowanceToUse = (annualAllowanceDays / 12) * monthsWorking;
      }
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

  onStartDateChange(): void {
    this.calculateTotalAvailable();
  }
}