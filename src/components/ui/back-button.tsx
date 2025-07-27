import { useTranslation } from 'react-i18next'
import { HotspotId } from '../../config/hotspots'
import { selectHotspot, useGarden } from '../../hooks/garden'
import { cn } from '../../utils/cn'

export function BackButton() {
  const { t } = useTranslation()
  const selected = useGarden((state) => state.selected)
  const isShown = selected !== null && selected !== HotspotId.Projects

  return (
    <button

      type="button"
      onClick={() => selectHotspot(null)}
      className={cn(
        'cursor-pointer absolute top-20 left-5 z-30 rounded-full bg-white/30 px-3.5 py-2 font-mono',
        'text-[11px] tracking-[0.18em] text-black/75 uppercase ring-1 ring-white/45 ring-inset',
        'backdrop-blur-md transition-opacity duration-300 sm:top-24 sm:left-8',
        isShown ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      ← {t('back')}
    </button>
  )
}
