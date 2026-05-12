import { Injectable, signal, effect } from '@angular/core';
export type Language = 'nl' | 'en';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'portfolio_lang';
  currentLang = signal<Language>('nl');
  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Language | null;
    if (saved === 'nl' || saved === 'en') {
      this.currentLang.set(saved);
    }
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, this.currentLang());
    });
  }
  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
  }
  toggle(): void {
    this.currentLang.update(l => (l === 'nl' ? 'en' : 'nl'));
  }
}
