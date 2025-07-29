import { useSyncExternalStore } from 'react'
import { CameraView } from '../config/scene'

const listeners = new Set<() => void>()

let cameraView = CameraView.Isometric

function subscribe(listener: () => void) {
  listeners.add(listener)

  return function unsubscribe() {
    listeners.delete(listener)
  }
}

export function getCameraView() {
  return cameraView
}

export function setCameraView(view: CameraView) {
  if (view === cameraView) {
    return
  }

  cameraView = view

  for (const listener of listeners) {
    listener()
  }
}

export function useCameraView() {
  return useSyncExternalStore(subscribe, getCameraView)
}
