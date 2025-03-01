export interface CalendarConfig {
  locale: string;
  country: string;
  weekStartsOn: 0 | 1 | 6;
  defaultLanguage: string;
  supportedLanguages: string[];
  dateFormat: string;
  workingDays: number[];
}

export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = {
  locale: 'it-IT',
  country: 'IT',
  weekStartsOn: 1,
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
  dateFormat: 'MM/dd/yyyy',
  workingDays: [1, 2, 3, 4, 5]
};

export const COUNTRY_CONFIGS: Record<string, CalendarConfig> = {
  IT: {
    locale: 'it-IT',
    country: 'IT',
    defaultLanguage: 'it',
    supportedLanguages: ['it', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  FR: {
    locale: 'fr-FR',
    country: 'FR',
    defaultLanguage: 'fr',
    supportedLanguages: ['fr', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  US: {
    locale: 'us-US',
    country: 'US',
    defaultLanguage: 'en',
    supportedLanguages: [ 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 0
  },
  // Add more countries as needed
}