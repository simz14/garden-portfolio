import { useSyncExternalStore } from 'react'
import { skyConfig } from '../config/garden'

export interface SkyState {
  horizonColor: string
  hazeColor: string
  midColor: string
  topColor: string
  hazeStop: number
  midStop: number
}

const listeners = new Set<() => void>()

let skyState: SkyState = {
  horizonColor: skyConfig.horizonColor,
  hazeColor: skyConfig.hazeColor,
  midColor: skyConfig.midColor,
  topColor: skyConfig.topColor,
  hazeStop: skyConfig.stops[1],
  midStop: skyConfig.stops[2],
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return function unsubscribe() {
    listeners.delete(listener)
  }
}

export function getSky() {
  return skyState
}

export function setSky(patch: Partial<SkyState>) {
  skyState = { ...skyState, ...patch }

  for (const listener of listeners) {
    listener()
  }
}

export function useSky() {
  return useSyncExternalStore(subscribe, getSky)
}
