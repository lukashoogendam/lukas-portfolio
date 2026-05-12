import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { ApiResponse } from '../services/portfolio-api.service';
import { environment } from '../../../environments/environment';
export const adminGuard: CanActivateFn = () => {
  const http = inject(HttpClient);
  const router = inject(Router);
  return http.get<ApiResponse<{ email: string; authenticated: boolean; role: string }>>(
    `${environment.apiUrl}/auth/me`,
    { withCredentials: true }
  ).pipe(
    map(res => {
      if (res.data.role === 'ADMIN') {
        return true;
      }
      router.navigate(['/unauthorized']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
