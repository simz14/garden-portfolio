import { useEffect, useRef } from 'react'
import type { PointLight } from 'three'
import { shedConfig, shedLightConfig } from '../../../../config/shed'
import { createLampRevealTween } from '../../../../animations/shed'
import { useGarden } from '../../../../hooks/garden'
import { HotspotId } from '../../../../config/hotspots'

export function Lamp() {
  const isRevealed = useGarden((state) => state.selected === HotspotId.Tech && state.isReached)
  const lightRef = useRef<PointLight>(null)

  useEffect(() => {
    const light = lightRef.current

    if (!light) {
      return
    }

    const tween = createLampRevealTween(light, isRevealed)

    return function killTween() {
      tween.kill()
    }
  }, [isRevealed])

  return (
    <pointLight
      ref={lightRef}
      color={shedLightConfig.color}
      intensity={0}
      distance={shedLightConfig.distance}
      decay={shedLightConfig.decay}
      position-y={shedConfig.floorHeight + shedConfig.height * shedLightConfig.heightRatio}
    />
  )
}
