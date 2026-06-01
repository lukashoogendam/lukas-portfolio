import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="site-bg-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>
    <app-navbar />
    <router-outlet />
  `,
  styles: []
})
export class AppComponent {}
