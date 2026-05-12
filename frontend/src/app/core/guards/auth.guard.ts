import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { ApiResponse } from '../services/portfolio-api.service';
import { environment } from '../../../environments/environment';
export const authGuard: CanActivateFn = () => {
  const http = inject(HttpClient);
  const router = inject(Router);
  return http.get<ApiResponse<{ email: string; authenticated: boolean }>>(
    `${environment.apiUrl}/auth/me`,
    { withCredentials: true }
  ).pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
