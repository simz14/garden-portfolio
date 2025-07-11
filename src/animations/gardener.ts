import { gsap } from 'gsap'
import type { Group, Vector3 } from 'three'
import { gardenerConfig, gardenerMotionConfig, taskTimeConfig } from '../config/gardener'
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

export function createGreetingTimeline(body: Group, parts: GardenerParts) {
  const { greetSwing, greetLean } = gardenerMotionConfig

  return gsap
    .timeline({ repeat: -1, yoyo: true, paused: true })
    .fromTo(
      parts.arms[1].rotation,
      { z: gardenerConfig.armRaisedZ - greetSwing },
      { duration: 0.48, ease: 'sine.inOut', z: gardenerConfig.armRaisedZ + greetSwing },
      0,
    )
    .fromTo(
      body.rotation,
      { z: -greetLean },
      { duration: 0.96, ease: 'sine.inOut', z: greetLean },
      0,
    )
}

export function createGreetingSettleTween(body: Group, parts: GardenerParts) {
  return gsap
    .timeline({
      defaults: { duration: gardenerMotionConfig.greetSettleSeconds, ease: 'power2.out' },
    })
    .to(parts.arms[1].rotation, { z: gardenerConfig.armRestZ }, 0)
    .to(body.rotation, { z: 0 }, 0)
}

export function createSitTimeline(
  root: Group,
  body: Group,
  parts: GardenerParts,
  seat: { x: number, y: number, z: number },
) {
  return gsap
    .timeline({ defaults: { duration: taskTimeConfig.sitSeconds, ease: 'power2.inOut' } })
    .to(root.position, { x: seat.x, y: seat.y, z: seat.z }, 0)
    .to(body.rotation, { x: 0.12 }, 0)
    .to(parts.skirt.scale, { x: 0.72, z: 0.72 }, 0)
    .to([parts.arms[0].rotation, parts.arms[1].rotation], { x: -0.8 }, 0)
    .to([parts.legs[0].rotation, parts.legs[1].rotation], { x: -1.05 }, 0)
}

export function createStandTimeline(
  root: Group,
  body: Group,
  parts: GardenerParts,
  stand: { x: number, y: number, z: number },
) {
  return gsap
    .timeline({ defaults: { duration: taskTimeConfig.sitSeconds, ease: 'power2.inOut' } })
    .to(root.position, { x: stand.x, y: stand.y, z: stand.z }, 0)
    .to(body.rotation, { x: 0 }, 0)
    .to(parts.skirt.scale, { x: 1, z: 1 }, 0)
    .to([parts.arms[0].rotation, parts.arms[1].rotation], { x: 0 }, 0)
    .to(parts.arms[0].rotation, { z: -gardenerConfig.armRestZ }, 0)
    .to(parts.arms[1].rotation, { z: gardenerConfig.armRestZ }, 0)
    .to([parts.legs[0].rotation, parts.legs[1].rotation], { x: 0 }, 0)
}

export function createReachTimeline(body: Group, parts: GardenerParts) {
  return gsap
    .timeline({ defaults: { duration: taskTimeConfig.reachSeconds, ease: 'power2.out' } })
    .to(parts.arms[0].rotation, { x: -1.45 }, 0)
    .to(body.rotation, { x: 0.1 }, 0)
}

export function createSlideTimeline(body: Group, parts: GardenerParts) {
  return gsap
    .timeline({ defaults: { duration: taskTimeConfig.slideSeconds, ease: 'power2.inOut' } })
    .to(parts.arms[0].rotation, { x: -1.25 }, 0)
    .to(body.rotation, { x: 0.1, yoyo: true, repeat: 1, duration: taskTimeConfig.slideSeconds / 2 }, 0)
}

export function createCarryTween(parts: GardenerParts, onLift: (lift: number) => void) {
  const state = { lift: 0 }

  return gsap
    .timeline({ defaults: { duration: taskTimeConfig.carrySeconds, ease: 'power2.out' } })
    .to(parts.arms[0].rotation, { x: gardenerMotionConfig.carryArmX }, 0)
    .to(state, { lift: 1, onUpdate: () => onLift(state.lift) }, 0)
}

export function createPourTween(
  parts: GardenerParts,
  onTip: (tip: number, progress: number) => void,
) {
  const state = { progress: 0 }

  return gsap.to(state, {
    progress: 1,
    duration: taskTimeConfig.pourSeconds,
    ease: 'none',
    onUpdate() {
      const tip = Math.sin(state.progress * Math.PI)

      parts.arms[0].rotation.x =
        gardenerMotionConfig.carryArmX - tip * gardenerMotionConfig.pourArmSwing
      onTip(tip, state.progress)
    },
  })
}

export function createCanReturnTween(can: Group, rest: Vector3, restYaw: number) {
  return gsap
    .timeline({ defaults: { duration: taskTimeConfig.carrySeconds, ease: 'power2.inOut' } })
    .to(can.position, { x: rest.x, y: rest.y, z: rest.z }, 0)
    .to(can.rotation, { y: restYaw, z: 0 }, 0)
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
