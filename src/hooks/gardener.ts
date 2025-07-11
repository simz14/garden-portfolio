import { useEffect, useMemo, useRef } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { RefObject } from 'react'
import type { Camera, Group } from 'three'
import {

  createGreetingSettleTween,
  createGreetingTimeline,
  createRestTween,
  createStrideTimeline,
} from '../animations/gardener'
import type { GardenerParts } from '../components/3d/objects/gardener/body'
import { GardenControl } from '../config/controls'
import { gardenerConfig, gardenerMotionConfig, gardenerWalkConfig } from '../config/gardener'
import { hotspotConfig, hotspotIds } from '../config/hotspots'
import type { HotspotId } from '../config/hotspots'
import { dampAngle, getYawAngle } from '../utils/motion'
import { useGardenerTasks } from './tasks'
import { Tumble, getGarden, setGarden } from './garden'
import { useHotspotRegistry } from './hotspots'
import { setGardenerPosition } from './gardener-position'
import { useThumbstick } from './movement'
import { useWalker } from './walker'

const worldUp = new Vector3(0, 1, 0)

export function useGardenerActions(
  groupRef: RefObject<Group | null>,
  bodyRef: RefObject<Group | null>,
  partsRef: RefObject<GardenerParts | null>,
) {
  const walk = useWalker()
  const { setNearbyHotspot } = useHotspotRegistry()
  const { getThumbstick } = useThumbstick()
  const { runTask, stopTask } = useGardenerTasks()
  const [, getKeys] = useKeyboardControls<GardenControl>()

  const vectors = useMemo(
    () => ({ forward: new Vector3(), right: new Vector3(), step: new Vector3() }),
    [],
  )

  const motion = useRef({
    stride: null as gsap.core.Timeline | null,
    greeting: null as gsap.core.Timeline | null,
    isWalking: false,
    isGreeting: false,
  })

  useEffect(() => {
    const body = bodyRef.current
    const parts = partsRef.current
    const hasBody = body !== null && parts !== null

    if (!hasBody) {
      return
    }

    const stride = createStrideTimeline(body, parts)
    const greeting = createGreetingTimeline(body, parts)

    motion.current.stride = stride
    motion.current.greeting = greeting

    return function killTimelines() {
      stride.kill()
      greeting.kill()
      motion.current.stride = null
      motion.current.greeting = null
    }
  }, [bodyRef, partsRef])

  function startStride(pace: number) {
    motion.current.stride?.timeScale(gardenerMotionConfig.strideRate * pace).play()
    motion.current.isWalking = true
  }

  function stopStride(body: Group, parts: GardenerParts, shouldSettle: boolean) {
    if (!motion.current.isWalking) {
      return
    }

    motion.current.isWalking = false
    motion.current.stride?.pause()

    if (shouldSettle) {
      createRestTween(body, parts)
    }
  }

  function updateNearby(group: Group, previous: HotspotId | null) {
    let nearest: HotspotId | null = null
    let nearestDistance = Infinity

    for (const id of hotspotIds) {
      const [ringX, , ringZ] = hotspotConfig[id].ring
      const distance = Math.hypot(group.position.x - ringX, group.position.z - ringZ)

      const isWithinReach = distance < hotspotConfig[id].reach
      const isNearest = distance < nearestDistance

      if (isWithinReach && isNearest) {
        nearestDistance = distance
        nearest = id
      }
    }

    setNearbyHotspot(nearest)

    if (nearest !== previous) {
      setGarden({ nearby: nearest })
    }
  }

  function walkFreely(group: Group, body: Group, parts: GardenerParts, delta: number, camera: Camera) {
    camera.getWorldDirection(vectors.forward)
    vectors.forward.y = 0
    vectors.forward.normalize()
    vectors.right.crossVectors(vectors.forward, worldUp)

    const keys = getKeys()
    const stick = getThumbstick()

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

    vectors.step.addScaledVector(vectors.forward, stick.y)
    vectors.step.addScaledVector(vectors.right, stick.x)

    if (vectors.step.lengthSq() === 0) {
      stopStride(body, parts, true)
      walk(group.position, 0, 0, delta)

      return
    }

    const isKeyed = keys.forward || keys.backward || keys.left || keys.right
    const pace = isKeyed ? 1 : Math.min(1, Math.hypot(stick.x, stick.y))

    vectors.step.normalize().multiplyScalar(gardenerWalkConfig.speed * pace * delta)
    walk(group.position, vectors.step.x, vectors.step.z, delta)

    group.rotation.y = dampAngle(
      group.rotation.y,
      getYawAngle(vectors.step),
      gardenerWalkConfig.turnRate,
      delta,
    )

    startStride(pace)
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

    const garden = getGarden()

    if (garden.isGreeting) {
      motion.current.greeting?.play()
      motion.current.isGreeting = true

      return
    }

    if (motion.current.isGreeting) {
      motion.current.isGreeting = false
      motion.current.greeting?.pause()
      createGreetingSettleTween(body, parts)
    }

    if (garden.selected) {
      if (runTask(garden.selected, group, body, parts, delta)) {
        startStride(1)
      } else {
        stopStride(body, parts, false)
      }

      updateNearby(group, garden.nearby)

      return
    }

    if (stopTask(group, body, parts)) {
      updateNearby(group, garden.nearby)

      return
    }

    walkFreely(group, body, parts, delta, camera)

    if (group.position.y < gardenerWalkConfig.fallStartHeight) {
      setGarden({ tumble: Tumble.Falling })
    }

    if (group.position.y < gardenerWalkConfig.fallResetHeight) {
      group.position.set(...gardenerConfig.home)
      setGarden({ tumble: Tumble.Recovered, tumbleCount: garden.tumbleCount + 1 })
    }

    updateNearby(group, garden.nearby)
  })
}
