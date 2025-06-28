import { useEffect, useMemo, useRef } from 'react'
import { RingGeometry } from 'three'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import type { Mesh } from 'three'
import { createHotspotHoverTween } from '../../../animations/hotspots'
import { paletteConfig } from '../../../config/garden'
import { HotspotId, hotspotConfig, hotspotIds, hoverConfig } from '../../../config/hotspots'
import { useGarden } from '../../../hooks/garden'
import { useHotspotRegistry } from '../../../hooks/hotspots'

function createRingGeometry() {
  const geometry = new RingGeometry(
    hoverConfig.innerRadius,
    hoverConfig.outerRadius,
    hoverConfig.segments,
  )

  geometry.rotateX(-Math.PI / 2)

  return geometry
}

export function HotspotRings() {
  const { getHotspotGroup } = useHotspotRegistry()

  const hovered = useGarden((state) => state.hovered)
  const nearby = useGarden((state) => state.nearby)
  const selected = useGarden((state) => state.selected)

  const ringRefs = useRef<Partial<Record<HotspotId, Mesh>>>({})

  const geometry = useMemo(createRingGeometry, [])
  const materials = useMemo(
    () =>
      Object.fromEntries(
        hotspotIds.map((id) => [
          id,
          new MeshBasicNodeMaterial({
            color: paletteConfig.accent,
            transparent: true,
            opacity: 0,
            depthWrite: false,
          }),
        ]),
      ) as Record<HotspotId, MeshBasicNodeMaterial>,
    [],
  )

  useEffect(() => {
    return function disposeRings() {
      geometry.dispose()

      for (const material of Object.values(materials)) {
        material.dispose()
      }
    }
  }, [geometry, materials])

  const focused = selected ? null : (hovered ?? nearby)

  useEffect(() => {
    const tweens = hotspotIds.map((id) => {
      const ring = ringRefs.current[id]

      if (!ring) {
        return null
      }

      return createHotspotHoverTween(
        ring,
        materials[id],
        hotspotConfig[id].ringScale,
        getHotspotGroup(id),
        id === focused,
      )
    })

    return function killTweens() {
      for (const tween of tweens) {
        tween?.kill()
      }
    }
  }, [focused, materials, getHotspotGroup])

  return (
    <>
      {hotspotIds.map((id) => (
        <mesh
          key={id}
          ref={(ring) => {
            if (ring) {
              ringRefs.current[id] = ring
            } else {
              delete ringRefs.current[id]
            }
          }}
          geometry={geometry}
          material={materials[id]}
          position={hotspotConfig[id].ring}
          scale={hotspotConfig[id].ringScale}
          visible={false}
          raycast={() => null}
        />
      ))}
    </>
  )
}
