import { Component, input } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-loading-error-state',
  imports: [TranslatePipe],
  template: `
    @if (mode() === 'loading') {
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{ i18nPrefix() + '.loading' | t }}</p>
      </div>
    } @else {
      <div class="error-state">
        <div class="error-icon"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-alert"></use></svg></div>
        <h2>{{ i18nPrefix() + '.error_title' | t }}</h2>
        <p>{{ i18nPrefix() + '.error_message' | t }}</p>
        <ng-content></ng-content>
      </div>
    }
  `,
  styles: `.error-icon { font-size: 3rem; }`
})
export class LoadingErrorStateComponent {
  mode = input.required<'loading' | 'error'>();
  i18nPrefix = input.required<string>();
}
