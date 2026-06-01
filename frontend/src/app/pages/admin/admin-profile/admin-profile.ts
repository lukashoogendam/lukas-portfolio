import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { PortfolioApiService, Profile } from '../../../core/services/portfolio-api.service';

type TranslationLang = 'nl' | 'en';

@Component({
  selector: 'app-admin-profile',
  imports: [FormsModule],
  templateUrl: './admin-profile.html',
  styleUrl: '../admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminProfileComponent implements OnInit {
  private apiService = inject(PortfolioApiService);
  private adminApi = inject(AdminApiService);

  profile = signal<Profile | null>(null);
  profileLoading = signal(false);
  successMessage = signal<string | null>(null);

  formLang = signal<TranslationLang>('nl');
  formData = signal<Record<string, unknown>>({});
  
  translationData = signal<Record<string, unknown>>({});
  translationLoading = signal(false);
  translationLoaded = signal(false);

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileLoading.set(true);
    this.apiService.getProfile().subscribe({
      next: (res) => {
        this.profile.set(res.data);
        this.formData.set({ ...(res.data as any) });
        this.translationData.set({});
        this.translationLoaded.set(false);
        this.formLang.set('nl');
        this.profileLoading.set(false);
      },
      error: () => {
        this.formData.set({});
        this.profileLoading.set(false);
      }
    });
  }

  switchFormLang(lang: TranslationLang) {
    if (this.formLang() === lang) return;
    this.formLang.set(lang);
    if (lang === 'en' && !this.translationLoaded()) {
      this.loadTranslation();
    }
  }

  loadTranslation() {
    this.translationLoading.set(true);
    this.adminApi.getProfileTranslation('en').subscribe({
      next: (res) => {
        this.translationData.set({ ...(res.data as any) });
        this.translationLoading.set(false);
        this.translationLoaded.set(true);
      },
      error: () => {
        this.translationData.set({ role: '', focus: '', summary: '' });
        this.translationLoading.set(false);
        this.translationLoaded.set(true);
      }
    });
  }

  updateField(key: string, value: unknown) {
    if (this.formLang() === 'nl') {
      this.formData.update(data => ({ ...data, [key]: value }));
    } else {
      this.translationData.update(data => ({ ...data, [key]: value }));
    }
  }

  getFieldValue(key: string): any {
    return this.formLang() === 'nl' ? this.formData()[key] || '' : this.translationData()[key] || '';
  }

  saveItem() {
    const data = this.formData();
    this.adminApi.updateProfile(data).subscribe(() => {
      if (this.translationLoaded()) {
        const transData = this.translationData() as any;
        this.adminApi.upsertProfileTranslation('en', {
          role: transData.role || '',
          focus: transData.focus || '',
          summary: transData.summary || ''
        }).subscribe();
      }
      this.successMessage.set('Profiel opgeslagen');
      setTimeout(() => this.successMessage.set(null), 3000);
      this.loadProfile();
    });
  }
}
