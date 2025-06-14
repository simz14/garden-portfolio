import { useEffect, useRef } from 'react'
import { useRapier } from '@react-three/rapier'
import type { Vector3 } from 'three'
import { gardenerWalkConfig } from '../config/gardener'
import { physicsConfig } from '../config/scene'

type RapierWorld = ReturnType<typeof useRapier>['world']

interface WalkerParts {
  collider: ReturnType<RapierWorld['createCollider']>
  controller: ReturnType<RapierWorld['createCharacterController']>
}

const capsuleHalfHeight =
  (gardenerWalkConfig.colliderHeight - gardenerWalkConfig.colliderRadius * 2) / 2
const capsuleCentreHeight = capsuleHalfHeight + gardenerWalkConfig.colliderRadius
const gravity = physicsConfig.gravity[1]

export function useWalker() {
  const { world, rapier } = useRapier()
  const partsRef = useRef<WalkerParts | null>(null)
  const fallSpeed = useRef(0)

  useEffect(() => {
    const collider = world.createCollider(
      rapier.ColliderDesc.capsule(capsuleHalfHeight, gardenerWalkConfig.colliderRadius),
    )
    const controller = world.createCharacterController(gardenerWalkConfig.colliderSkin)

    controller.setUp({ x: 0, y: 1, z: 0 })
    controller.setSlideEnabled(true)
    controller.setApplyImpulsesToDynamicBodies(false)

    partsRef.current = { collider, controller }

    return function removeWalker() {
      partsRef.current = null
      world.removeCharacterController(controller)
      world.removeCollider(collider, false)
    }
  }, [rapier, world])

  return function moveWalker(position: Vector3, x: number, z: number, delta: number) {
    const parts = partsRef.current

    if (!parts) {
      position.x += x
      position.z += z

      return
    }
    fallSpeed.current += gravity * delta

    parts.collider.setTranslation({
      x: position.x,
      y: position.y + capsuleCentreHeight,
      z: position.z,
    })
    parts.controller.computeColliderMovement(parts.collider, {
      x,
      y: fallSpeed.current * delta,
      z,
    })

    const movement = parts.controller.computedMovement()

    position.x += movement.x
    position.y += movement.y
    position.z += movement.z

    if (parts.controller.computedGrounded()) {
      fallSpeed.current = 0
    }
  }
}
