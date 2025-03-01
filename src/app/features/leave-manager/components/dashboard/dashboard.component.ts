// src/app/features/leave-manager/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { UserConfigService } from '../../../employee-config/services/user-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoPipe,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  hasProfile = false;

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
      if (!this.hasProfile && !this.router.url.includes('/profile')) {
        this.router.navigate(['/profile']);
      }
    });
  }

  switchLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  getCurrentLang(): string {
    return this.translocoService.getActiveLang();
  }
}