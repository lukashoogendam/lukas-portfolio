import { DestroyRef, inject, signal, Signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, Observable, switchMap } from 'rxjs';
import { LanguageService } from '../services/language.service';

export interface LoadOnLangChangeResult<T> {
  data: Signal<T | null>;
  isLoading: Signal<boolean>;
  hasError: Signal<boolean>;
}

// Fetches a resource on init and refetches whenever LanguageService.currentLang()
// changes. switchMap cancels a stale in-flight request when the language flips
// again before it resolves; takeUntilDestroyed unsubscribes when the caller
// (component) is destroyed. A fetch error leaves the last-known-good data in
// place and only flips hasError.
export function loadOnLangChange<T>(fetchFn: () => Observable<T>): LoadOnLangChangeResult<T> {
  const langService = inject(LanguageService);
  const destroyRef = inject(DestroyRef);

  const data = signal<T | null>(null);
  const isLoading = signal(true);
  const hasError = signal(false);

  toObservable(langService.currentLang).pipe(
    switchMap(() => {
      isLoading.set(true);
      hasError.set(false);
      return fetchFn().pipe(
        catchError(() => {
          hasError.set(true);
          isLoading.set(false);
          return EMPTY;
        })
      );
    }),
    takeUntilDestroyed(destroyRef)
  ).subscribe(result => {
    data.set(result);
    isLoading.set(false);
  });

  return { data, isLoading, hasError };
}
