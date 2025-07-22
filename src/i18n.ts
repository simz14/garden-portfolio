import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Locale, localeConfig, locales } from './config/locales'
import en from './locales/en.json'
import sk from './locales/sk.json'

function getStartingLocale() {
  const saved = window.localStorage.getItem(localeConfig.storageKey)

  const isSavedSupported = saved !== null && locales.includes(saved as Locale)

  if (isSavedSupported) {
    return saved as Locale
  }

  const preferred = window.navigator.language.slice(0, 2)

  return locales.includes(preferred as Locale) ? (preferred as Locale) : localeConfig.fallback
}

i18next.use(initReactI18next).init({
  resources: {
    [Locale.English]: { garden: en },
    [Locale.Slovak]: { garden: sk },
  },
  lng: getStartingLocale(),
  fallbackLng: localeConfig.fallback,
  defaultNS: 'garden',
  interpolation: { escapeValue: false },
})

export { i18next }
