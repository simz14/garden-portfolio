import { useSyncExternalStore } from 'react'
import type { HotspotId } from '../config/hotspots'

interface GardenState {
  selected: HotspotId | null
  hovered: HotspotId | null
  nearby: HotspotId | null
  isReady: boolean
  isReached: boolean
  isDelivered: boolean
}

const initialState: GardenState = {
  selected: null,
  hovered: null,
  nearby: null,
  isReady: true,
  isReached: false,
  isDelivered: false,
}

const listeners = new Set<() => void>()

let gardenState = initialState

function notifyListeners() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return function unsubscribe() {
    listeners.delete(listener)
  }
}

export function getGarden() {
  return gardenState
}

export function setGarden(patch: Partial<GardenState>) {
  const keys = Object.keys(patch) as (keyof GardenState)[]
  const hasChange = keys.some((key) => patch[key] !== undefined && patch[key] !== gardenState[key])

  if (!hasChange) {
    return
  }

  gardenState = { ...gardenState, ...patch }
  notifyListeners()
}

export function resetGarden() {
  gardenState = initialState
  notifyListeners()
}

export function selectHotspot(id: HotspotId | null) {
  setGarden({ selected: id })
}

export function useGarden<T>(getSlice: (state: GardenState) => T) {
  return useSyncExternalStore(subscribe, () => getSlice(gardenState))
}
