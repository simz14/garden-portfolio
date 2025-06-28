import { gsap } from 'gsap'
import type { Group, Material, Object3D } from 'three'
import { shedDoorConfig, shedGlassConfig, shedLightConfig, shedRoofConfig } from '../config/shed'
import { cameraFocusConfig } from '../config/scene'

const revealDefaults = {
  duration: cameraFocusConfig.durationSeconds,
  ease: 'power2.inOut',
}

export function createRoofRevealTween(roof: Object3D, material: Material, isRevealed: boolean) {
  return gsap
    .timeline({ defaults: revealDefaults })
    .to(roof.position, { y: isRevealed ? shedRoofConfig.lift : 0 }, 0)
    .to(
      material,
      { opacity: isRevealed ? shedRoofConfig.revealedOpacity : shedRoofConfig.restingOpacity },
      0,
    )
}

export function createGlassRevealTween(material: Material, isRevealed: boolean) {
  return gsap.to(material, {
    ...revealDefaults,
    opacity: isRevealed ? shedGlassConfig.revealedOpacity : shedGlassConfig.restingOpacity,
  })
}

export function createLampRevealTween(light: { intensity: number }, isRevealed: boolean) {
  return gsap.to(light, {
    ...revealDefaults,
    intensity: isRevealed ? shedLightConfig.revealedIntensity : 0,
  })
}

export function createDoorSlideTween(door: Group, homeX: number, travel: number, isOpen: boolean) {
  return gsap.to(door.position, {
    x: isOpen ? homeX - travel : homeX,
    duration: shedDoorConfig.openSeconds,
    ease: 'power2.inOut',
  })
}
