import { useEffect, useMemo, useRef } from 'react'
import { ExtrudeGeometry, Shape } from 'three'
import { MeshLambertNodeMaterial } from 'three/webgpu'
import type { Mesh } from 'three'
import { paletteConfig } from '../../../../config/garden'
import { shedConfig, shedRoofConfig } from '../../../../config/shed'
import { createRoofRevealTween } from '../../../../animations/shed'
import { useGarden } from '../../../../hooks/garden'
import { HotspotId } from '../../../../config/hotspots'

const halfWidth = shedConfig.width / 2
const halfDepth = shedConfig.depth / 2

function createRoofGeometry() {
  const gable = new Shape()

  gable.moveTo(-halfDepth - shedRoofConfig.overhang, 0)
  gable.lineTo(halfDepth + shedRoofConfig.overhang, 0)
  gable.lineTo(0, shedRoofConfig.peakHeight)
  gable.closePath()

  const geometry = new ExtrudeGeometry(gable, {
    depth: shedConfig.width + shedRoofConfig.depthMargin,
    bevelEnabled: false,
  })

  geometry.rotateY(Math.PI / 2)
  geometry.translate(
    -(halfWidth + shedRoofConfig.depthMargin / 2),
    shedConfig.floorHeight + shedConfig.height,
    0,
  )

  return geometry
}

export function Roof() {
  const isRevealed = useGarden((state) => state.selected === HotspotId.Tech && state.isReached)
  const roofRef = useRef<Mesh>(null)

  const geometry = useMemo(createRoofGeometry, [])
  const material = useMemo(
    () =>
      new MeshLambertNodeMaterial({
        color: paletteConfig.glass,
        transparent: true,
        opacity: shedRoofConfig.restingOpacity,
      }),
    [],
  )

  useEffect(() => {
    return function disposeRoof() {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useEffect(() => {
    const roof = roofRef.current

    if (!roof) {
      return
    }

    const tween = createRoofRevealTween(roof, material, isRevealed)

    return function killTween() {
      tween.kill()
    }
  }, [isRevealed, material])

  return <mesh ref={roofRef} geometry={geometry} material={material} castShadow />
}
