import { AuthService } from './auth.service';
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const AuthGuard = (): boolean => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) {
    return true;
  }

  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuth = authService.IsAuthenticated();

  if (isAuth) return true;

  router.navigate(['auth']);
  return false;
}
