import type { Group, Vector3 } from 'three'
import { bedConfig } from '../config/beds'

interface WateringCanApi {
  group: Group
  pour: (delta: number, from: Vector3, direction: Vector3, isPouring: boolean) => void
  clear: () => void
}

const bedProgress = bedConfig.beds.map(() => 0)

let wateringCan: WateringCanApi | null = null

function setBedProgress(index: number, progress: number) {
  bedProgress[index] = progress
}

function getBedProgress(index: number) {
  return bedProgress[index] ?? 0
}

function resetBedProgress() {
  bedProgress.fill(0)
}

function registerWateringCan(api: WateringCanApi) {
  wateringCan = api

  return function unregisterWateringCan() {
    wateringCan = null
  }
}

function getWateringCan() {
  return wateringCan
}

export function useWateringRegistry() {
  return {
    setBedProgress,
    getBedProgress,
    resetBedProgress,
    registerWateringCan,
    getWateringCan,
  }
}
