import { useTranslation } from 'react-i18next'
import { HotspotId } from '../../config/hotspots'
import { techList } from '../../data/tech'
import { techConfig } from '../../config/tech'
import { useIsCompact } from '../../hooks/device'
import { selectHotspot, useGarden } from '../../hooks/garden'
import { cn } from '../../utils/cn'
import { TechBadge } from '../3d/labels/tech-stack/tech-badge'

export function TechDrawer() {
  const { t } = useTranslation()
  const isCompact = useIsCompact()
  const isOpen = useGarden((state) => state.selected === HotspotId.Tech && state.isReached)

  if (!isCompact) {
    return null
  }

  return (
    <aside
      aria-hidden={!isOpen}
      aria-label={t('zones.tech.name')}
      className={cn(
        'absolute inset-x-0 bottom-0 z-60 flex max-h-[62svh] flex-col',
        'rounded-t-2xl border-t border-white/50 bg-white/45 backdrop-blur-2xl',
        'transition-transform duration-500 ease-out',
        isOpen
          ? 'translate-y-0 shadow-[0_-16px_48px_-24px_rgba(0,0,0,0.45)]'
          : 'pointer-events-none translate-y-full',
      )}
    >
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/50 px-5 py-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-[0.28em] text-black/50 uppercase">
            {t('zones.tech.name')}
          </span>
          <p className="text-base leading-tight text-black">{t('zones.tech.title')}</p>
        </div>

        <button
          type="button"
          onClick={() => selectHotspot(null)}
          className="cursor-pointer shrink-0 rounded-sm border border-black/20 px-2 py-0.5 text-xs text-black/70 transition-colors hover:border-black hover:text-black"
        >
          {t('close')}
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-2">
          <ul className="flex flex-wrap items-start gap-1.5">
            {techList.slice(0, techConfig.primaryCount).map((brand, index) => (
              <TechBadge key={brand.name} brand={brand} index={index} isOpen={isOpen} isLead />
            ))}
          </ul>

          <ul className="flex flex-wrap gap-1">
            {techList.slice(techConfig.primaryCount).map((brand, index) => (
              <TechBadge
                key={brand.name}
                brand={brand}
                index={techConfig.primaryCount + index}
                isOpen={isOpen}
              />
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
