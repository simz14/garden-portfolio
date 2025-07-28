import { useCallback, useRef } from 'react'
import { Html } from '@react-three/drei'
import { MathUtils, Vector3 } from 'three'
import type { Camera, Object3D } from 'three'
import { useTranslation } from 'react-i18next'
import { HotspotId } from '../../../config/hotspots'
import { techConfig } from '../../../config/tech'
import { techList } from '../../../data/tech'
import { useIsCompact } from '../../../hooks/device'
import { useGarden } from '../../../hooks/garden'
import { cn } from '../../../utils/cn'
import { TechBadge } from './tech-stack/tech-badge'

const projected = new Vector3()

export function TechStack() {
  const { t } = useTranslation()
  const isCompact = useIsCompact()
  const isOpen = useGarden((state) => state.selected === HotspotId.Tech && state.isReached)

  const listRef = useRef<HTMLUListElement>(null)

  const calculatePosition = useCallback(
    (el: Object3D, camera: Camera, size: { width: number, height: number }) => {
      projected.setFromMatrixPosition(el.matrixWorld).project(camera)

      const halfWidth = size.width / 2
      const halfHeight = size.height / 2
      const x = projected.x * halfWidth + halfWidth
      const y = -(projected.y * halfHeight) + halfHeight

      const listWidth = listRef.current?.offsetWidth ?? 0

      if (!listWidth) {
        return [x, y]
      }

      const padding = techConfig.pinnedPadding
      const furthest = Math.max(padding, size.width - listWidth - padding)

      return [MathUtils.clamp(x, padding, furthest), y]
    },
    [],
  )

  if (isCompact) {
    return null
  }

  return (
    <Html
      position={techConfig.anchor}
      calculatePosition={calculatePosition}
      pointerEvents="none"
      style={{ pointerEvents: 'none' }}
    >
      <ul
        ref={listRef}
        aria-label={t('zones.tech.name')}
        className={cn(
          'flex w-max max-w-[62vw] -translate-y-1/2 flex-col items-start gap-1.5 sm:max-w-none',
        )}
      >
        {techList.slice(0, techConfig.primaryCount).map((brand, index) => (
          <TechBadge key={brand.name} brand={brand} index={index} isOpen={isOpen} isLead />
        ))}

        <li className="mt-1 max-w-[62vw] sm:max-w-64">
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
        </li>
      </ul>
    </Html>
  )
}
