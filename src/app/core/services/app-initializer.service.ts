import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserConfigService } from '../../features/employee-config/services/user-config.service';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  private userConfigService = inject(UserConfigService);
  private router = inject(Router);

  async initialize(): Promise<boolean> {
    try {
      const profile = await firstValueFrom(this.userConfigService.getUserProfile().pipe(take(1)));

      // If no profile and user is not already on profile page, navigate to profile page
      if (!profile && !window.location.pathname.includes('/profile')) {
        this.router.navigate(['/profile']);
      }

      return true;
    } catch (error) {
      console.error('Error initializing app:', error);
      return true; // Still return true to complete initialization
    }
  }
}