// src/app/features/leave-manager/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabNav, MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { UserConfigService } from '../../../employee-config/services/user-config.service';
import { CalendarComponent } from '../../../calendar/components/calendar/calendar.component';
import { UserProfileComponent } from '../../../employee-config/components/user-profile/user-profile.component';
 import { TranslationService } from '../../../../i18n/translation.service';


interface LanguageOption {
  code: string;
  name: string;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
     CommonModule,
    TranslocoPipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    CalendarComponent,
    UserProfileComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  hasProfile = false;
  selectedTabIndex = 0;
  availableLanguages: LanguageOption[] = [];

  constructor(
    private translationService: TranslationService,
    private userConfigService: UserConfigService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user has a profile
    this.userConfigService.getUserProfile().subscribe(profile => {
      this.hasProfile = !!profile;

      // If no profile exists and not already on profile page, navigate to profile
      if (!this.hasProfile) {
        this.selectedTabIndex = 1; // Profile tab
      }
    });

    this.translationService.getAvailableLanguages().subscribe(
      languages => this.availableLanguages = languages
    );
    console.log(this.availableLanguages);
  }

  onTabChange(index: number) {
    // If user has no profile and is trying to access calendar tab, enforce profile tab
    if (!this.hasProfile && index === 0) {
      this.selectedTabIndex = 1;
    }
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }

  getCurrentLang(): string {
    return this.translationService.getCurrentLang();
  }
}