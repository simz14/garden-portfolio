import { gsap } from 'gsap'
import type { Group, Mesh } from 'three'
import type { MeshBasicNodeMaterial } from 'three/webgpu'
import { hoverConfig } from '../config/hotspots'

export function createHotspotHoverTween(
  ring: Mesh,
  material: MeshBasicNodeMaterial,
  ringScale: number,
  group: Group | undefined,
  isActive: boolean,
) {
  const state = { lift: material.opacity / hoverConfig.ringOpacity }

  return gsap.to(state, {
    lift: isActive ? 1 : 0,
    duration: hoverConfig.seconds,
    ease: 'power2.out',
    onUpdate() {
      if (group) {
        group.position.y = state.lift * hoverConfig.lift
      }

      ring.visible = state.lift > 0.01
      ring.scale.setScalar(ringScale * (0.94 + state.lift * 0.06))
      material.opacity = state.lift * hoverConfig.ringOpacity
    },
  })
}
