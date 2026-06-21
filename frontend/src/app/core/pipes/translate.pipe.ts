import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { TranslationKey } from '../i18n';

@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private langService = inject(LanguageService);

  transform(key: string): string {
    return this.langService.t(key as TranslationKey);
  }
}
