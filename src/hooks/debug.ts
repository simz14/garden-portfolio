import { useSyncExternalStore } from 'react'
import { physicsConfig } from '../config/scene'

interface DebugState {
  isPanelVisible: boolean
  isPhysicsVisible: boolean
}

const listeners = new Set<() => void>()

let debugState: DebugState = {
  isPanelVisible: false,
  isPhysicsVisible: physicsConfig.isDebugVisible,
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return function unsubscribe() {
    listeners.delete(listener)
  }
}

export function getDebugState() {
  return debugState
}

export function setDebugState(patch: Partial<DebugState>) {
  debugState = { ...debugState, ...patch }

  for (const listener of listeners) {
    listener()
  }
}

export function useDebugState() {
  return useSyncExternalStore(subscribe, getDebugState)
}
