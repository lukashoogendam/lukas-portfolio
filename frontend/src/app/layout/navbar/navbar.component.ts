import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  host: {
    '(window:scroll)': 'onScroll()'
  }
})
export class NavbarComponent {
  langService = inject(LanguageService);
  router = inject(Router);
  isMobileMenuOpen = signal(false);
  isScrolled = signal(false);
  isHomePage = signal(true);

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.isHomePage.set(e.url === '/' || e.url === '');
    });
  }

  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  scrollTo(sectionId: string): void {
    this.closeMobileMenu();
    if (this.isHomePage()) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
    }
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
