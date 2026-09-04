import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private router = inject(Router);

  scrollToId(id: string): void {
    if (this.router.url === '/' || this.router.url === '') {
      this.scrollIntoView(id);
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scrollIntoView(id);
        }, 300);
      });
    }
  }

  private scrollIntoView(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
