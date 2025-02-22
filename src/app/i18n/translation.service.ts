import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@ngneat/transloco'; // Recommended for 2025

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(
    private translocoService: TranslocoService
  ) {}

  setLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }
}