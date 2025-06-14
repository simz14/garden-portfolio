import { Vector3 } from 'three'

const gardenerPosition = new Vector3()

export function setGardenerPosition(position: Vector3) {
  gardenerPosition.copy(position)
}

export function getGardenerPosition() {
  return gardenerPosition
}
