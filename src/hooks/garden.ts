import { useSyncExternalStore } from 'react'
import type { HotspotId } from '../config/hotspots'

export enum Tumble {
  None = 'none',
  Falling = 'falling',
  Recovered = 'recovered',
}

interface GardenState {
  selected: HotspotId | null
  hovered: HotspotId | null
  nearby: HotspotId | null
  hasEntered: boolean
  isReady: boolean
  isGreeting: boolean
  isSeated: boolean
  isReached: boolean
  isDelivered: boolean
  tumble: Tumble
  tumbleCount: number
}

const initialState: GardenState = {
  selected: null,
  hovered: null,
  nearby: null,
  hasEntered: false,
  isReady: false,
  isGreeting: true,
  isSeated: false,
  isReached: false,
  isDelivered: false,
  tumble: Tumble.None,
  tumbleCount: 0,
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

export function enterGarden() {
  setGarden({ hasEntered: true })
}

export function selectHotspot(id: HotspotId | null) {
  setGarden({ selected: id, isGreeting: id ? false : gardenState.isGreeting })
}

export function useGarden<T>(getSlice: (state: GardenState) => T) {
  return useSyncExternalStore(subscribe, () => getSlice(gardenState))
}
