import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiResponse } from './portfolio-api.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);
  private router = inject(Router);
  isLoggedIn = signal(false);
  currentEmail = signal<string | null>(null);
  currentRole = signal<string | null>(null);
  isAdmin = computed(() => this.currentRole() === 'ADMIN');
  checkAuth(): void {
    this.http.get<ApiResponse<{ email: string; authenticated: boolean; role: string }>>(
      `${this.baseUrl}/me`, { withCredentials: true }
    ).subscribe({
      next: (res) => {
        this.isLoggedIn.set(true);
        this.currentEmail.set(res.data.email);
        this.currentRole.set(res.data.role);
      },
      error: () => {
        this.isLoggedIn.set(false);
        this.currentEmail.set(null);
        this.currentRole.set(null);
      }
    });
  }
  login(email: string, password: string): void {
    this.http.post<ApiResponse<void>>(
      `${this.baseUrl}/login`,
      { email, password },
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.isLoggedIn.set(true);
        this.currentEmail.set(email);
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.isLoggedIn.set(false);
        this.loginError.set('Ongeldige inloggegevens');
      }
    });
  }
  logout(): void {
    this.http.post<ApiResponse<void>>(
      `${this.baseUrl}/logout`, {},
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.isLoggedIn.set(false);
        this.currentEmail.set(null);
        this.currentRole.set(null);
        this.router.navigate(['/login']);
      }
    });
  }
  loginError = signal<string | null>(null);
  clearError(): void {
    this.loginError.set(null);
  }
}
