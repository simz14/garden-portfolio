import { Vector3 } from 'three'
import { gardenerConfig } from '../config/gardener'
import { oakBenchConfig, oakConfig } from '../config/oak'
import { getYawAngle } from './motion'
import { getWorldOffset } from './garden'

const benchFacing = new Vector3(...oakBenchConfig.facing).normalize()

export function getBenchFacing() {
  return getYawAngle(benchFacing)
}

export function getBenchSeat() {
  const oakOrigin = new Vector3(getWorldOffset(oakConfig.x), 0, getWorldOffset(oakConfig.y))
  const sit = new Vector3(...oakBenchConfig.at).add(oakOrigin).setY(oakBenchConfig.seatTop)

  const stand = sit.clone().setY(0).addScaledVector(benchFacing, oakBenchConfig.standDistance)

  sit.addScaledVector(benchFacing, oakBenchConfig.seatShift)

  sit.y -=
    (gardenerConfig.skirtHeight - oakBenchConfig.hipDrop) * gardenerConfig.scale +
    oakBenchConfig.seatSink

  return { sit, stand, facing: getBenchFacing() }
}
