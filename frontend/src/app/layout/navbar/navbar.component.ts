import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';
import { ScrollService } from '../../core/services/scroll.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  host: {
    '(window:scroll)': 'onScroll()'
  }
})
export class NavbarComponent {
  langService = inject(LanguageService);
  themeService = inject(ThemeService);
  scrollService = inject(ScrollService);
  isMobileMenuOpen = signal(false);
  isScrolled = signal(false);

  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  scrollTo(sectionId: string): void {
    this.closeMobileMenu();
    this.scrollService.scrollToId(sectionId);
  }

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
