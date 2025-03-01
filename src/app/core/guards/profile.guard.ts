import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { UserConfigService } from '../../features/employee-config/services/user-config.service';

export const profileGuard = () => {
  const userConfigService = inject(UserConfigService);
  const router = inject(Router);

  return userConfigService.getUserProfile().pipe(
    take(1),
    map(profile => {
      if (!profile) {
        // No profile exists, redirect to profile setup
        return router.createUrlTree(['/profile']);
      }
      return true;
    })
  );
};