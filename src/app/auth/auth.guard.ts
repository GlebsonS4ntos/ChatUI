import { AuthService } from './auth.service';
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { catchError, map, of, Observable } from 'rxjs';

export const AuthGuard = (): Observable<boolean> => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (!isBrowser) {
    return of(true);
  }

  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuth = authService.IsAuthenticated();

  if (isAuth) {
    const isValidToken = authService.IsValidToken();

    if (!isValidToken) {
      return authService.RefreshToken().pipe(
        map((result) => {
          if (result && result.accesstoken) {
            authService.SetAccessToken(result.accesstoken);
            return true;
          } else {
            router.navigate(['auth']);
            return false;
          }
        }),
        catchError((error) => {
          router.navigate(['auth']);
          return of(false);
        })
      );
    } else {
      return of(true);
    }
  }

  router.navigate(['auth']);
  return of(false);
}

export const GuestGuard = () => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!isBrowser) return of(true);

  const isAuth = authService.IsAuthenticated();

  if (isAuth) {
    const isValidToken = authService.IsValidToken();

    if (!isValidToken) {
      return authService.RefreshToken().pipe(
        map((result) => {
          if (result && result.accesstoken) {
            authService.SetAccessToken(result.accesstoken);
            router.navigate(['chat']);
            return false;
          } else {
            return true;
          }
        }),
        catchError((error) => {
          return of(true);
        })
      );
    } else {
      router.navigate(['chat']);
      return of(false);
    }
  }

  return of(true);
};
