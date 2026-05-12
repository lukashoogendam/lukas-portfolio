import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  langService = inject(LanguageService);
  isMobileMenuOpen = signal(false);
  setLang(lang: 'nl' | 'en'): void {
    this.langService.setLanguage(lang);
    this.closeMobileMenu();
  }
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }
  closeMobileMenu(): void {
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }
}
