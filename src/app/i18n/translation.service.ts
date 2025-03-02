import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface LanguageOption {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private languageOptions$ = new BehaviorSubject<LanguageOption[]>([]);

  constructor(private translocoService: TranslocoService) {
    this.initializeLanguageOptions();
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

  private initializeLanguageOptions(): void {
    // Get available languages from Transloco
    const langs = this.translocoService.getAvailableLangs();

    // Get the language codes as an array
    const langCodes = langs.map(lang => typeof lang === 'string' ? lang : lang.id);

    // Load language names from each translation file
    const langObservables: Observable<LanguageOption>[] = langCodes.map(code => {
      return this.translocoService.selectTranslation(code).pipe(
        map(translations => ({
          code,
          // Try to get the language name from translations, or fall back to the code
          name: translations?.['language']?.name || code
        })),
        catchError(() => of({ code, name: code }))
      );
    });

    // When all language names are loaded, update the languageOptions$ subject
    forkJoin(langObservables).subscribe(
      languages => this.languageOptions$.next(languages)
    );
  }
}