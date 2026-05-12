import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {

  name = signal('');
  email = signal('');
  message = signal('');
  isSubmitting = signal(false);
  isSuccess = signal(false);
  errorMessage = signal('');

  private apiService = inject(PortfolioApiService);

  onSubmit(): void {
    const isMissingFields = !this.name() || !this.email() || !this.message();
    if (isMissingFields) {
      this.errorMessage.set('Vul alle velden in.');
      return;
    }

    const isMessageTooShort = this.message().length < 10;
    if (isMessageTooShort) {
      this.errorMessage.set('Bericht moet minimaal 10 tekens bevatten.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.apiService.sendContactMessage({
      name: this.name(),
      email: this.email(),
      message: this.message()
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
        this.name.set('');
        this.email.set('');
        this.message.set('');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Er is een fout opgetreden. Probeer het opnieuw.');
      }
    });
  }
}
