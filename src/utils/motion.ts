import { MathUtils } from 'three'
import type { Vector3 } from 'three'

export function getSmoothingFactor(rate: number, delta: number) {
  return 1 - Math.exp(-rate * delta)
}

export function getYawAngle(direction: Vector3) {
  return Math.atan2(direction.x, direction.z)
}

export function getShortestAngleDelta(from: number, to: number) {
  return MathUtils.euclideanModulo(to - from + Math.PI, Math.PI * 2) - Math.PI
}

export function dampAngle(current: number, target: number, rate: number, delta: number) {
  const unwrappedTarget = current + getShortestAngleDelta(current, target)

  return MathUtils.damp(current, unwrappedTarget, rate, delta)
}
