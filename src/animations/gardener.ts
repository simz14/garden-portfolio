import { gsap } from 'gsap'
import type { Group } from 'three'
import { gardenerConfig, gardenerMotionConfig } from '../config/gardener'
import type { GardenerParts } from '../components/3d/objects/gardener/body'

export function createStrideTimeline(body: Group, parts: GardenerParts) {
  const { armSwing, legSwing, strideBounce } = gardenerMotionConfig
  const half = { duration: 0.5, ease: 'sine.inOut' }
  const bounce = { duration: 0.25, ease: 'sine.out' }
  const bounceRepeat = half.duration * 2 / bounce.duration - 1

  return gsap
    .timeline({ repeat: -1, paused: true })
    .fromTo(parts.arms[0].rotation, { x: -armSwing }, { ...half, x: armSwing }, 0)
    .fromTo(parts.arms[1].rotation, { x: armSwing }, { ...half, x: -armSwing }, 0)
    .fromTo(parts.legs[0].rotation, { x: legSwing }, { ...half, x: -legSwing }, 0)
    .fromTo(parts.legs[1].rotation, { x: -legSwing }, { ...half, x: legSwing }, 0)
    .to(parts.arms[0].rotation, { ...half, x: -armSwing }, 0.5)
    .to(parts.arms[1].rotation, { ...half, x: armSwing }, 0.5)
    .to(parts.legs[0].rotation, { ...half, x: legSwing }, 0.5)
    .to(parts.legs[1].rotation, { ...half, x: -legSwing }, 0.5)
    .fromTo(
      body.position,
      { y: 0 },
      { ...bounce, y: strideBounce, repeat: bounceRepeat, yoyo: true },
      0,
    )
}

export function createRestTween(body: Group, parts: GardenerParts) {
  return gsap
    .timeline({ defaults: { duration: 0.35, ease: 'power2.out' } })
    .to([parts.arms[0].rotation, parts.legs[0].rotation, parts.legs[1].rotation], { x: 0 }, 0)
    .to(parts.arms[1].rotation, { x: 0, z: gardenerConfig.armRestZ }, 0)
    .to(parts.arms[0].rotation, { z: -gardenerConfig.armRestZ }, 0)
    .to(body.rotation, { x: 0, z: 0 }, 0)
    .to(body.position, { y: 0 }, 0)
    .to(parts.skirt.scale, { x: 1, z: 1 }, 0)
}
