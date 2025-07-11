import { useMemo, useRef } from 'react'
import { Vector3 } from 'three'
import type { Group } from 'three'
import {

  createCanReturnTween,
  createCarryTween,
  createPourTween,
  createReachTimeline,
  createSitTimeline,
  createSlideTimeline,
  createStandTimeline,
} from '../animations/gardener'
import type { GardenerParts } from '../components/3d/objects/gardener/body'
import { gardenerWalkConfig } from '../config/gardener'
import { HotspotId } from '../config/hotspots'
import { dropletConfig, wateringCanConfig } from '../config/watering-can'
import { createDeliveryDelay } from '../animations/mailbox'
import { taskSpotConfig, wateringSpots } from '../utils/tasks'
import type { TaskSpot } from '../utils/tasks'
import { dampAngle, getShortestAngleDelta } from '../utils/motion'
import { getBenchSeat } from '../utils/oak'
import { setGarden } from './garden'
import { useWateringRegistry } from './watering'

interface TaskState {
  arrivedAt: HotspotId | null
  wateringStep: number
  isPouring: boolean
  carryLift: number
  sitting: gsap.core.Timeline | null
  standing: gsap.core.Timeline | null
  reaching: gsap.core.Timeline | null
  delivering: gsap.core.Tween | null
  carrying: gsap.core.Timeline | null
  pouring: gsap.core.Tween | null
  returning: gsap.core.Timeline | null
}

const canRest = new Vector3(...wateringCanConfig.rest)
const canSpout = new Vector3(...wateringCanConfig.spout)

export function useGardenerTasks() {
  const { setBedProgress, resetBedProgress, getWateringCan } = useWateringRegistry()

  const state = useRef<TaskState>({
    arrivedAt: null,
    wateringStep: 0,
    isPouring: false,
    carryLift: 0,
    sitting: null,
    standing: null,
    reaching: null,
    delivering: null,
    carrying: null,
    pouring: null,
    returning: null,
  })

  const scratch = useMemo(
    () => ({ hand: new Vector3(), spout: new Vector3(), pour: new Vector3() }),
    [],
  )

  function turnTowards(group: Group, facing: number, delta: number) {
    group.rotation.y = dampAngle(
      group.rotation.y,
      facing,
      gardenerWalkConfig.slowTurnRate,
      delta,
    )
  }

  function stepTowards(group: Group, target: Vector3, delta: number) {
    const toTargetX = target.x - group.position.x
    const toTargetZ = target.z - group.position.z
    const distance = Math.hypot(toTargetX, toTargetZ)

    if (distance <= gardenerWalkConfig.arrivalDistance) {
      return true
    }

    const step = Math.min(distance, gardenerWalkConfig.slowSpeed * delta)

    group.position.x += (toTargetX / distance) * step
    group.position.z += (toTargetZ / distance) * step

    group.rotation.y = dampAngle(
      group.rotation.y,
      Math.atan2(toTargetX, toTargetZ),
      gardenerWalkConfig.turnRate,
      delta,
    )
    return false
  }

  function startPose(id: HotspotId, group: Group, body: Group, parts: GardenerParts) {
    if (id === HotspotId.About) {
      state.current.standing?.kill()
      state.current.standing = null
      state.current.sitting = createSitTimeline(group, body, parts, getBenchSeat().sit)
      setGarden({ isSeated: true })
      return
    }

    if (id === HotspotId.Contact) {
      state.current.reaching = createReachTimeline(body, parts).eventCallback('onComplete', () => {
        setGarden({ isReached: true })

        state.current.delivering = createDeliveryDelay(() => {
          setGarden({ isDelivered: true })
        })
      })
      return
    }

    if (id === HotspotId.Tech) {
      state.current.reaching = createSlideTimeline(body, parts).eventCallback('onComplete', () => {
        setGarden({ isReached: true })
      })
      return
    }

    state.current.returning?.kill()
    state.current.returning = null

    state.current.carrying = createCarryTween(parts, (lift) => {
      state.current.carryLift = lift
    })
  }

  function carryCan(group: Group, parts: GardenerParts, delta: number, tip: number) {
    const can = getWateringCan()

    if (!can) {
      return
    }

    group.updateMatrixWorld(true)
    parts.hands[0].getWorldPosition(scratch.hand)
    const carriedYaw = group.rotation.y - Math.PI / 2

    can.group.position.lerpVectors(canRest, scratch.hand, state.current.carryLift)
    can.group.rotation.y =
      wateringCanConfig.restYaw +
      getShortestAngleDelta(wateringCanConfig.restYaw, carriedYaw) * state.current.carryLift
    can.group.rotation.z = -tip * wateringCanConfig.tipAngle
    can.group.updateMatrixWorld(true)

    scratch.spout.copy(canSpout).applyMatrix4(can.group.matrixWorld)
    scratch.pour.set(1, 0, 0).applyQuaternion(can.group.quaternion).setY(0).normalize()

    can.pour(delta, scratch.spout, scratch.pour, tip > dropletConfig.pourThreshold)
  }

  function returnCan() {
    state.current.carrying?.kill()
    state.current.carrying = null
    state.current.pouring?.kill()
    state.current.pouring = null

    const can = getWateringCan()

    if (!can) {
      return
    }

    can.clear()
    state.current.returning = createCanReturnTween(
      can.group,
      canRest,
      wateringCanConfig.restYaw,
    ).eventCallback('onComplete', () => {
      state.current.returning = null
    })
  }

  function runWatering(group: Group, spot: TaskSpot, parts: GardenerParts, delta: number) {
    const stop = wateringSpots[state.current.wateringStep]

    if (!stop) {
      turnTowards(group, spot.facing, delta)
      carryCan(group, parts, delta, 0)

      return false
    }

    if (!stepTowards(group, stop.stand, delta)) {
      carryCan(group, parts, delta, 0)

      return true
    }

    turnTowards(group, stop.facing, delta)

    if (!state.current.isPouring) {
      const step = state.current.wateringStep

      state.current.isPouring = true

      state.current.pouring = createPourTween(parts, (tip, progress) => {
        setBedProgress(step, progress)
        carryCan(group, parts, delta, tip)
      }).eventCallback('onComplete', () => {
        setBedProgress(step, 1)
        state.current.pouring = null
        state.current.wateringStep += 1
        state.current.isPouring = false
      })
    }

    return false
  }

  function runTask(id: HotspotId, group: Group, body: Group, parts: GardenerParts, delta: number) {
    const spot = taskSpotConfig[id]

    if (state.current.arrivedAt !== id) {
      if (!stepTowards(group, spot.stand, delta)) {
        return true
      }

      state.current.arrivedAt = id
      startPose(id, group, body, parts)

      return false
    }

    if (id === HotspotId.Projects) {
      return runWatering(group, spot, parts, delta)
    }

    turnTowards(group, spot.facing, delta)

    return false
  }

  function stopTask(group: Group, body: Group, parts: GardenerParts) {
    if (state.current.standing) {
      return true
    }

    if (!state.current.arrivedAt) {
      return false
    }

    const wasSeated = state.current.arrivedAt === HotspotId.About
    const wasWatering = state.current.arrivedAt === HotspotId.Projects

    state.current.arrivedAt = null
    state.current.wateringStep = 0
    state.current.isPouring = false
    state.current.carryLift = 0

    if (wasWatering) {
      returnCan()
    }

    state.current.reaching?.kill()
    state.current.reaching = null
    state.current.delivering?.kill()
    state.current.delivering = null

    resetBedProgress()
    setGarden({ isSeated: false, isReached: false, isDelivered: false })

    if (!wasSeated) {
      return false
    }

    state.current.sitting?.kill()
    state.current.sitting = null
    state.current.standing = createStandTimeline(
      group,
      body,
      parts,
      getBenchSeat().stand,
    ).eventCallback('onComplete', () => {
      state.current.standing = null
    })

    return true
  }

  return { runTask, stopTask }
}
