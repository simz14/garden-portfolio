import { Locale, localeConfig, locales } from '../../../config/locales'
import { useLocale } from '../../../hooks/locale'
import { cn } from '../../../utils/cn'

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center">
      {locales.map((option) => (
        <button
          key={option}

          type="button"
          aria-current={option === locale}
          onClick={() => setLocale(option as Locale)}
          className={cn(
            'cursor-pointer px-1 py-1 text-sm uppercase font-elsie transition-opacity',
            option === locale ? 'font-bold' : 'opacity-60 hover:opacity-100',
          )}
        >
          {localeConfig.labels[option]}
        </button>
      ))}
    </div>
  )
}
