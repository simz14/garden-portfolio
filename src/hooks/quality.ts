import { useSyncExternalStore } from 'react'

export enum QualityLevel {
  High = 'high',
  Low = 'low',
}

const listeners = new Set<() => void>()

let qualityLevel: QualityLevel = QualityLevel.High

function subscribe(listener: () => void) {
  listeners.add(listener)

  return function unsubscribe() {
    listeners.delete(listener)
  }
}

export function getQualityLevel() {
  return qualityLevel
}

export function setQualityLevel(level: QualityLevel) {
  if (level === qualityLevel) {
    return
  }

  qualityLevel = level

  for (const listener of listeners) {
    listener()
  }
}

export function useQualityLevel() {
  return useSyncExternalStore(subscribe, getQualityLevel)
}
