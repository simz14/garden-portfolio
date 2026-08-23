import { Html } from '@react-three/drei'
import { MathUtils, Vector3 } from 'three'
import type { Camera, Object3D } from 'three'
import { useTranslation } from 'react-i18next'
import { hotspotConfig, hotspotIds } from '../../../config/hotspots'
import { labelConfig } from '../../../config/labels'
import { useIsTouch } from '../../../hooks/device'
import { selectHotspot, useGarden } from '../../../hooks/garden'
import { cn } from '../../../utils/cn'

const projected = new Vector3()

function keepOnScreen(
  object: Object3D,
  camera: Camera,
  size: { width: number, height: number },
): [number, number] {
  projected.setFromMatrixPosition(object.matrixWorld).project(camera)

  const x = projected.x * (size.width / 2) + size.width / 2
  const y = -(projected.y * (size.height / 2)) + size.height / 2

  return [
    MathUtils.clamp(x, labelConfig.edgeX, Math.max(labelConfig.edgeX, size.width - labelConfig.edgeX)),
    MathUtils.clamp(y, labelConfig.edgeTop, Math.max(labelConfig.edgeTop, size.height - labelConfig.edgeBottom)),
  ]
}

export function HotspotMarkers() {
  const { t } = useTranslation()
  const isTouch = useIsTouch()

  const isReady = useGarden((state) => state.isReady)
  const selected = useGarden((state) => state.selected)
  const hovered = useGarden((state) => state.hovered)
  const nearby = useGarden((state) => state.nearby)

  return (
    <>
      {hotspotIds.map((id) => {
        const isActive = hovered === id || selected === id

        return (
          <Html
            key={id}
            position={hotspotConfig[id].labelAnchor}
            zIndexRange={[30, 20]}
            pointerEvents="none"
            style={{ pointerEvents: 'none' }}
            calculatePosition={keepOnScreen}
          >
            <button

              type="button"
              style={{ transform: 'translate(-50%, -100%)' }}
              onClick={() => selectHotspot(selected === id ? null : id)}
              aria-expanded={selected === id}
              className={cn(
                'cursor-pointer flex flex-col items-center p-2 transition-opacity duration-500',
                isReady && !selected
                  ? 'pointer-events-auto opacity-100'
                  : 'pointer-events-none opacity-0',
              )}
            >
              <span
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5 font-elsie text-[11px] tracking-[0.18em] whitespace-nowrap backdrop-blur-md transition-colors duration-300',
                  'shadow-[0_8px_24px_-16px_rgba(0,0,0,0.6)] ring-1 ring-inset',
                  isActive
                    ? 'bg-accent/70 text-black/85 ring-white/50'
                    : 'bg-white/20 text-black/60 ring-white/35',
                )}
              >
                {t(`zones.${id}.name`)}

                {nearby === id && selected !== id && (
                  <span className="rounded-full bg-black/10 px-1.5 py-0.5 tracking-normal">
                    {t(isTouch ? 'tapKey' : 'enterKey')}
                  </span>
                )}
              </span>

              <span className="h-6 w-px bg-black/20" />

              <span
                className={cn(
                  'size-2 rounded-full border border-white/60 transition-colors duration-300',
                  isActive ? 'bg-accent ring-5 ring-accent/25' : 'bg-accent/70 ring-4 ring-white/20',
                )}
              />
            </button>
          </Html>
        )
      })}
    </>
  )
}
