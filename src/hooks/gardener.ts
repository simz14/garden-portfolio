import { useMemo } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { RefObject } from 'react'
import type { Camera, Group } from 'three'
import { GardenControl } from '../config/controls'
import { gardenerWalkConfig } from '../config/gardener'
import { dampAngle, getYawAngle } from '../utils/motion'
import { setGardenerPosition } from './gardener-position'
import { useWalker } from './walker'

const worldUp = new Vector3(0, 1, 0)

export function useGardenerActions(groupRef: RefObject<Group | null>) {
  const walk = useWalker()
  const [, getKeys] = useKeyboardControls<GardenControl>()

  const vectors = useMemo(
    () => ({ forward: new Vector3(), right: new Vector3(), step: new Vector3() }),
    [],
  )

  function walkFreely(group: Group, delta: number, camera: Camera) {
    camera.getWorldDirection(vectors.forward)
    vectors.forward.y = 0
    vectors.forward.normalize()
    vectors.right.crossVectors(vectors.forward, worldUp)

    const keys = getKeys()

    vectors.step.set(0, 0, 0)

    if (keys.forward) {
      vectors.step.add(vectors.forward)
    }

    if (keys.backward) {
      vectors.step.sub(vectors.forward)
    }

    if (keys.right) {
      vectors.step.add(vectors.right)
    }

    if (keys.left) {
      vectors.step.sub(vectors.right)
    }

    if (vectors.step.lengthSq() === 0) {
      walk(group.position, 0, 0, delta)

      return
    }

    vectors.step.normalize().multiplyScalar(gardenerWalkConfig.speed * delta)
    walk(group.position, vectors.step.x, vectors.step.z, delta)

    group.rotation.y = dampAngle(
      group.rotation.y,
      getYawAngle(vectors.step),
      gardenerWalkConfig.turnRate,
      delta,
    )
  }

  useFrame(({ camera }, delta) => {
    const group = groupRef.current

    if (!group) {
      return
    }

    setGardenerPosition(group.position)
    walkFreely(group, delta, camera)
  })
}
