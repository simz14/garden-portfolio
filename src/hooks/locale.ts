import { useTranslation } from 'react-i18next'
import { Locale, localeConfig } from '../config/locales'

export function useLocale() {
  const { i18n } = useTranslation()

  function setLocale(locale: Locale) {
    window.localStorage.setItem(localeConfig.storageKey, locale)
    i18n.changeLanguage(locale)
  }

  return { locale: i18n.language as Locale, setLocale }
}
