import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

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
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    TranslocoPipe
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  accrued = 0;
  remaining = 0;

  constructor(
    private fb: FormBuilder,
    private userConfigService: UserConfigService,
    private translocoService: TranslocoService
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.userConfigService.getUserProfile().subscribe(profile => {
      if (profile) {
        this.profileForm.patchValue(profile);
        this.calculateLeaveMetrics();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      startDate: [null, Validators.required],
      annualAllowance: [22, [Validators.required, Validators.min(0)]],
      usedLeave: [0, [Validators.required, Validators.min(0)]],
      carriedOver: [0, [Validators.required, Validators.min(0)]],
      email: ['', [Validators.email]],
      preferredLanguage: [this.translocoService.getActiveLang()]
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const profile: UserProfile = this.profileForm.value;
      this.userConfigService.saveUserProfile(profile);
      this.calculateLeaveMetrics();
    }
  }

  private calculateLeaveMetrics(): void {
    const profile: UserProfile = this.profileForm.value;
    this.accrued = this.userConfigService.calculateAccruedLeave(profile);
    this.remaining = this.userConfigService.calculateRemainingLeave(profile);
  }

  changeLanguage(lang: string): void {
    this.translocoService.setActiveLang(lang);
    this.profileForm.patchValue({ preferredLanguage: lang });
  }
}