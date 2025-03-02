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
  // European NATO members
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
  DE: {
    locale: 'de-DE',
    country: 'DE',
    defaultLanguage: 'de',
    supportedLanguages: ['de', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  ES: {
    locale: 'es-ES',
    country: 'ES',
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  UK: {
    locale: 'en-GB',
    country: 'UK',
    defaultLanguage: 'en',
    supportedLanguages: ['en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  BE: {
    locale: 'nl-BE',
    country: 'BE',
    defaultLanguage: 'nl',
    supportedLanguages: ['nl', 'fr', 'de', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  NL: {
    locale: 'nl-NL',
    country: 'NL',
    defaultLanguage: 'nl',
    supportedLanguages: ['nl', 'en'],
    dateFormat: 'dd-MM-yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  DK: {
    locale: 'da-DK',
    country: 'DK',
    defaultLanguage: 'da',
    supportedLanguages: ['da', 'en'],
    dateFormat: 'dd-MM-yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  NO: {
    locale: 'nb-NO',
    country: 'NO',
    defaultLanguage: 'nb',
    supportedLanguages: ['nb', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  PT: {
    locale: 'pt-PT',
    country: 'PT',
    defaultLanguage: 'pt',
    supportedLanguages: ['pt', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  IS: {
    locale: 'is-IS',
    country: 'IS',
    defaultLanguage: 'is',
    supportedLanguages: ['is', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  GR: {
    locale: 'el-GR',
    country: 'GR',
    defaultLanguage: 'el',
    supportedLanguages: ['el', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  TR: {
    locale: 'tr-TR',
    country: 'TR',
    defaultLanguage: 'tr',
    supportedLanguages: ['tr', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  PL: {
    locale: 'pl-PL',
    country: 'PL',
    defaultLanguage: 'pl',
    supportedLanguages: ['pl', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  CZ: {
    locale: 'cs-CZ',
    country: 'CZ',
    defaultLanguage: 'cs',
    supportedLanguages: ['cs', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  HU: {
    locale: 'hu-HU',
    country: 'HU',
    defaultLanguage: 'hu',
    supportedLanguages: ['hu', 'en'],
    dateFormat: 'yyyy.MM.dd',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  RO: {
    locale: 'ro-RO',
    country: 'RO',
    defaultLanguage: 'ro',
    supportedLanguages: ['ro', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  BG: {
    locale: 'bg-BG',
    country: 'BG',
    defaultLanguage: 'bg',
    supportedLanguages: ['bg', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  SK: {
    locale: 'sk-SK',
    country: 'SK',
    defaultLanguage: 'sk',
    supportedLanguages: ['sk', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  LT: {
    locale: 'lt-LT',
    country: 'LT',
    defaultLanguage: 'lt',
    supportedLanguages: ['lt', 'en'],
    dateFormat: 'yyyy-MM-dd',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  LV: {
    locale: 'lv-LV',
    country: 'LV',
    defaultLanguage: 'lv',
    supportedLanguages: ['lv', 'en'],
    dateFormat: 'yyyy-MM-dd',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  EE: {
    locale: 'et-EE',
    country: 'EE',
    defaultLanguage: 'et',
    supportedLanguages: ['et', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  HR: {
    locale: 'hr-HR',
    country: 'HR',
    defaultLanguage: 'hr',
    supportedLanguages: ['hr', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  SI: {
    locale: 'sl-SI',
    country: 'SI',
    defaultLanguage: 'sl',
    supportedLanguages: ['sl', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  AL: {
    locale: 'sq-AL',
    country: 'AL',
    defaultLanguage: 'sq',
    supportedLanguages: ['sq', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  ME: {
    locale: 'sr-ME',
    country: 'ME',
    defaultLanguage: 'sr',
    supportedLanguages: ['sr', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  MK: {
    locale: 'mk-MK',
    country: 'MK',
    defaultLanguage: 'mk',
    supportedLanguages: ['mk', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  // North American NATO members
  CA: {
    locale: 'en-CA',
    country: 'CA',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'fr'],
    dateFormat: 'yyyy-MM-dd',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 0
  },
  US: {
    locale: 'en-US',
    country: 'US',
    defaultLanguage: 'en',
    supportedLanguages: ['en'],
    dateFormat: 'MM/dd/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 0
  },
  // Asia/Pacific
  CN: {
    locale: 'zh-CN',
    country: 'CN',
    defaultLanguage: 'zh',
    supportedLanguages: ['zh', 'en'],
    dateFormat: 'yyyy-MM-dd',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  IN: {
    locale: 'en-IN',
    country: 'IN',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'hi', 'ta', 'te', 'mr', 'gu', 'bn'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  AU: {
    locale: 'en-AU',
    country: 'AU',
    defaultLanguage: 'en',
    supportedLanguages: ['en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  JP: {
    locale: 'ja-JP',
    country: 'JP',
    defaultLanguage: 'ja',
    supportedLanguages: ['ja', 'en'],
    dateFormat: 'yyyy/MM/dd',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 0
  },
  KR: {
    locale: 'ko-KR',
    country: 'KR',
    defaultLanguage: 'ko',
    supportedLanguages: ['ko', 'en'],
    dateFormat: 'yyyy-MM-dd',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 0
  },
  SG: {
    locale: 'en-SG',
    country: 'SG',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'zh', 'ms', 'ta'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 0
  },
  NZ: {
    locale: 'en-NZ',
    country: 'NZ',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'mi'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  // South America
  BR: {
    locale: 'pt-BR',
    country: 'BR',
    defaultLanguage: 'pt',
    supportedLanguages: ['pt', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 0
  },
  AR: {
    locale: 'es-AR',
    country: 'AR',
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 0
  },
  CL: {
    locale: 'es-CL',
    country: 'CL',
    defaultLanguage: 'es',
    supportedLanguages: ['es', 'en'],
    dateFormat: 'dd-MM-yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  // Middle East & Africa
  ZA: {
    locale: 'en-ZA',
    country: 'ZA',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'af', 'zu', 'xh'],
    dateFormat: 'yyyy/MM/dd',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  IL: {
    locale: 'he-IL',
    country: 'IL',
    defaultLanguage: 'he',
    supportedLanguages: ['he', 'ar', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [0, 1, 2, 3, 4], // Sunday-Thursday
    weekStartsOn: 0
  },
  AE: {
    locale: 'ar-AE',
    country: 'AE',
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [0, 1, 2, 3, 4], // Sunday-Thursday
    weekStartsOn: 6 // Saturday
  },
  SA: {
    locale: 'ar-SA',
    country: 'SA',
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en'],
    dateFormat: 'dd/MM/yyyy',
    workingDays: [0, 1, 2, 3, 4], // Sunday-Thursday
    weekStartsOn: 6 // Saturday
  },
  // Russia and former Soviet states
  RU: {
    locale: 'ru-RU',
    country: 'RU',
    defaultLanguage: 'ru',
    supportedLanguages: ['ru', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  },
  KZ: {
    locale: 'kk-KZ',
    country: 'KZ',
    defaultLanguage: 'kk',
    supportedLanguages: ['kk', 'ru', 'en'],
    dateFormat: 'dd.MM.yyyy',
    workingDays: [1, 2, 3, 4, 5],
    weekStartsOn: 1
  }
};