export enum Locale {
  English = 'en',
  Slovak = 'sk',
}

export const localeConfig = {
  fallback: Locale.English,
  storageKey: 'locale',
  labels: {
    [Locale.English]: 'EN',
    [Locale.Slovak]: 'SK',
  },
}

export const locales = Object.values(Locale)
