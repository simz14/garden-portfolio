import { useEffect, useMemo, useRef } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { RefObject } from 'react'
import type { Camera, Group } from 'three'
import { createRestTween, createStrideTimeline } from '../animations/gardener'
import type { GardenerParts } from '../components/3d/objects/gardener/body'
import { GardenControl } from '../config/controls'
import { gardenerMotionConfig, gardenerWalkConfig } from '../config/gardener'
import { dampAngle, getYawAngle } from '../utils/motion'
import { setGardenerPosition } from './gardener-position'
import { useWalker } from './walker'

const worldUp = new Vector3(0, 1, 0)

export function useGardenerActions(
  groupRef: RefObject<Group | null>,
  bodyRef: RefObject<Group | null>,
  partsRef: RefObject<GardenerParts | null>,
) {
  const walk = useWalker()
  const [, getKeys] = useKeyboardControls<GardenControl>()

  const vectors = useMemo(
    () => ({ forward: new Vector3(), right: new Vector3(), step: new Vector3() }),
    [],
  )

  const motion = useRef({
    stride: null as gsap.core.Timeline | null,
    isWalking: false,
  })

  useEffect(() => {
    const body = bodyRef.current
    const parts = partsRef.current
    const hasBody = body !== null && parts !== null

    if (!hasBody) {
      return
    }

    motion.current.stride = createStrideTimeline(body, parts)
  }, [bodyRef, partsRef])

  function startStride() {
    motion.current.stride?.timeScale(gardenerMotionConfig.strideRate).play()
    motion.current.isWalking = true
  }

  function stopStride(body: Group, parts: GardenerParts) {
    if (!motion.current.isWalking) {
      return
    }

    motion.current.isWalking = false
    motion.current.stride?.pause()
    createRestTween(body, parts)
  }

  function walkFreely(group: Group, body: Group, parts: GardenerParts, delta: number, camera: Camera) {
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
      stopStride(body, parts)
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

    startStride()
  }

  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.1)
    const group = groupRef.current
    const body = bodyRef.current
    const parts = partsRef.current
    const hasBody = group !== null && body !== null && parts !== null

    if (!hasBody) {
      return
    }

    setGardenerPosition(group.position)
    walkFreely(group, body, parts, delta, camera)
  })
}
