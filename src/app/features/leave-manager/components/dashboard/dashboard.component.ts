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

  private languageNames: Record<string, string> = {
    'en': 'English',
    'it': 'Italiano',
    'fr': 'Français',
    'de': 'Deutsch',
    'es': 'Español'
    // Add more languages as needed
  };

  constructor(
    private translocoService: TranslocoService,
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

    this.loadAvailableLanguages();
  }

  loadAvailableLanguages() {
    // Get available languages from Transloco
    const langs = this.translocoService.getAvailableLangs();

    // Convert to array of LanguageOption objects
    this.availableLanguages = langs.map(lang => {
      // Handle if lang is a string or object with code property
      const langCode = typeof lang === 'string' ? lang : lang.id;
      console.log(langCode);
      return {
        code: langCode,
        name: this.getLanguageName(langCode)
      };
    });

  }

  getLanguageName(langCode: string): string {
    // Return the mapped language name or use the code if not found
    return this.languageNames[langCode] || langCode;
  }


  onTabChange(index: number) {
    // If user has no profile and is trying to access calendar tab, enforce profile tab
    if (!this.hasProfile && index === 0) {
      this.selectedTabIndex = 1;
    }
  }

  switchLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  getCurrentLang(): string {
    return this.translocoService.getActiveLang();
  }
}