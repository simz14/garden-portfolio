import { useMemo } from 'react'
import { butterflyConfig } from '../../../config/ambience'
import { seedConfig } from '../../../config/random'
import { useIsReducedMotion } from '../../../hooks/device'
import { QualityLevel, useQualityLevel } from '../../../hooks/quality'
import { createRandom } from '../../../utils/random'
import { Butterfly } from './butterflies/butterfly'
import type { Flight } from './butterflies/butterfly'

function createFlock(count: number): Flight[] {
  const getRandom = createRandom(seedConfig.butterflies)
  const half = butterflyConfig.homeSpread / 2

  return Array.from({ length: count }, () => ({
    homeX: getRandom() * butterflyConfig.homeSpread - half,
    homeZ: getRandom() * butterflyConfig.homeSpread - half,
    radius: butterflyConfig.minRadius + getRandom() * butterflyConfig.radiusSwing,
    speed: butterflyConfig.minSpeed + getRandom() * butterflyConfig.speedSwing,
    height: butterflyConfig.minHeight + getRandom() * butterflyConfig.heightSwing,
    phase: getRandom() * Math.PI * 2,
  }))
}

export function Butterflies() {
  const isReducedMotion = useIsReducedMotion()
  const qualityLevel = useQualityLevel()

  const count = isReducedMotion
    ? 0
    : qualityLevel === QualityLevel.High
      ? butterflyConfig.highCount
      : butterflyConfig.lowCount

  const flock = useMemo(() => createFlock(count), [count])

  return (
    <>
      {flock.map((flight, index) => (
        <Butterfly
          key={index}
          flight={flight}
          colors={butterflyConfig.wingColors[index % butterflyConfig.wingColors.length]}
        />
      ))}
    </>
  )
}
