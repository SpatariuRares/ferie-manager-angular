import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

export interface LanguageOption {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  // Default language names as fallback
  private defaultLanguageNames: Record<string, string> = {
    'it': 'Italiano',
    'en': 'English',
    'fr': 'Français',
    'de': 'Deutsch',
    'es': 'Español'
  };

  private languageOptions$ = new BehaviorSubject<LanguageOption[]>([]);

  constructor(private translocoService: TranslocoService) {
    // Create initial language options with default names
    this.setInitialLanguageOptions();

    // Then try to load the proper names asynchronously
    this.loadLanguageNamesFromFiles();
  }

  setLanguage(lang: string): void {
    this.translocoService.setActiveLang(lang);
  }

  getCurrentLang(): string {
    return this.translocoService.getActiveLang();
  }

  getAvailableLanguages(): Observable<LanguageOption[]> {
    return this.languageOptions$.asObservable();
  }

  // Set initial language options with default names
  private setInitialLanguageOptions(): void {
    const langs = this.translocoService.getAvailableLangs();
    const langCodes = langs.map(lang => typeof lang === 'string' ? lang : lang.id);

    const initialOptions = langCodes.map(code => ({
      code,
      name: this.defaultLanguageNames[code] || code
    }));

    this.languageOptions$.next(initialOptions);
  }

  // Try to load language names from translation files
  private loadLanguageNamesFromFiles(): void {
    const langs = this.translocoService.getAvailableLangs();
    const langCodes = langs.map(lang => typeof lang === 'string' ? lang : lang.id);

    // Create observables to fetch each language's translations
    const langObservables = langCodes.map(code =>
      this.translocoService.selectTranslation(code).pipe(
        take(1),
        map(translations => {
          // Try to get the language name from translation file
          const nameFromFile = translations?.['language']?.name;
          return {
            code,
            name: nameFromFile || this.defaultLanguageNames[code] || code
          };
        }),
        catchError(() => of({
          code,
          name: this.defaultLanguageNames[code] || code
        }))
      )
    );

    // When all translations are loaded, update language options
    forkJoin(langObservables).subscribe(languageOptions => {
      this.languageOptions$.next(languageOptions);
    });
  }
}