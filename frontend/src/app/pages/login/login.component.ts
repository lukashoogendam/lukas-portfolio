import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  authService = inject(AuthService);

  email = signal('');
  password = signal('');
  isSubmitting = signal(false);

  onSubmit(): void {
    const email = this.email().trim();
    const password = this.password();

    const isEmpty = !email || !password;
    if (isEmpty) return;

    this.authService.clearError();
    this.isSubmitting.set(true);
    this.authService.login(email, password);

    // Reset submitting state after a short delay
    setTimeout(() => this.isSubmitting.set(false), 1500);
  }
}
