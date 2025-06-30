import { gsap } from 'gsap'
import type { Group, PointLight } from 'three'
import { oakCanopyConfig, oakConfig, oakLightConfig } from '../config/oak'
import { cameraFocusConfig } from '../config/scene'

export function createCanopyRevealTween(canopy: Group, light: PointLight, isRevealed: boolean) {
  const scale = isRevealed ? 1 + oakCanopyConfig.focusGrowth : 1
  const height = isRevealed
    ? oakConfig.trunkHeight + oakCanopyConfig.focusLift
    : oakConfig.trunkHeight

  return gsap
    .timeline({ defaults: { duration: cameraFocusConfig.durationSeconds, ease: 'power2.inOut' } })
    .to(canopy.position, { y: height }, 0)
    .to(canopy.scale, { x: scale, y: scale, z: scale }, 0)
    .to(light, { intensity: isRevealed ? oakLightConfig.focusIntensity : 0 }, 0)
}
