import { Html } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import { bedConfig } from '../../../config/beds'
import { labelConfig } from '../../../config/labels'
import { HotspotId } from '../../../config/hotspots'
import { projectsData } from '../../../data/projects'
import { useIsCompact } from '../../../hooks/device'
import { useGarden } from '../../../hooks/garden'
import { getWorldOffset } from '../../../utils/garden'
import { cn } from '../../../utils/cn'

export function BedLabels() {
  const { t } = useTranslation()
  const isCompact = useIsCompact()
  const isOpen = useGarden((state) => state.selected === HotspotId.Projects)

  if (isCompact) {
    return null
  }

  return (
    <>
      {bedConfig.beds.map((bed, index) => {
        const project = projectsData[index]

        if (!project) {
          return null
        }

        return (
          <Html
            key={project.slug}
            position={[
              getWorldOffset(bed.x) + bedConfig.size / 2,
              labelConfig.bedLabelHeight,
              getWorldOffset(bed.y) + bedConfig.size / 2,
            ]}
            zIndexRange={[30, 20]}
            pointerEvents="none"
            style={{ pointerEvents: 'none' }}
          >
            <span
              style={{ transform: 'translate(-50%, -100%)' }}
              className={cn(
                'block rounded-full bg-white/20 px-2.5 py-1 text-[10px] tracking-[0.14em] whitespace-nowrap text-black/60 ring-1 ring-white/35 ring-inset backdrop-blur-md transition-opacity duration-500 font-elsie',
                isOpen ? 'opacity-100' : 'opacity-0',
              )}
            >
              {t(`projects.items.${project.slug}.title`)}
            </span>
          </Html>
        )
      })}
    </>
  )
}
