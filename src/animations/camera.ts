import { gsap } from 'gsap'
import { Color, Vector3 } from 'three'
import type { Fog } from 'three'
import type { CameraControls } from '@react-three/drei'
import { hotspotConfig } from '../config/hotspots'
import type { HotspotId } from '../config/hotspots'
import { fogConfig, cameraConfig, cameraFocusConfig, introConfig } from '../config/scene'
import { getFittedZoom } from '../utils/camera'

interface Viewport {
  width: number
  height: number
}

const introColor = new Color(introConfig.fogColor)
const settledColor = new Color(fogConfig.fogColor)
const targetVector = new Vector3()

export function createIntroTimeline(
  controls: CameraControls,
  fog: Fog,
  viewport: Viewport,
  isReducedMotion: boolean,
  onDone: () => void,
) {
  const settledZoom = getFittedZoom(viewport.width, viewport.height)
  const state = { progress: 0 }

  controls.dollyTo(cameraConfig.distance + introConfig.distance, false)
  controls.zoomTo(introConfig.zoom, false)

  return gsap.to(state, {
    progress: 1,
    duration: isReducedMotion ? introConfig.reducedDurationSeconds : introConfig.durationSeconds,
    ease: 'power3.out',
    onUpdate() {
      const distance = cameraConfig.distance + (1 - state.progress) * introConfig.distance

      controls.dollyTo(distance, false)
      controls.zoomTo(gsap.utils.interpolate(introConfig.zoom, settledZoom, state.progress), false)

      fog.near =
        distance *
        gsap.utils.interpolate(
          introConfig.fogNearRatio,
          fogConfig.fogNear / cameraConfig.distance,
          state.progress,
        )
      fog.far =
        distance *
        gsap.utils.interpolate(
          introConfig.fogFarRatio,
          fogConfig.fogFar / cameraConfig.distance,
          state.progress,
        )
      fog.color.copy(introColor).lerp(settledColor, state.progress)
    },
    onComplete: onDone,
  })
}

export function createFocusTimeline(
  controls: CameraControls,
  fog: Fog,
  viewport: Viewport,
  selected: HotspotId | null,
) {
  const settledZoom = getFittedZoom(viewport.width, viewport.height)
  const focus = selected ? hotspotConfig[selected] : null
  const aim = focus ? focus.focusAim : cameraConfig.target

  controls.maxPolarAngle = Math.max(cameraConfig.polarAngle, cameraFocusConfig.polarAngle)

  controls.getTarget(targetVector)

  const state = {
    x: targetVector.x,
    y: targetVector.y,
    z: targetVector.z,
    zoom: controls.camera.zoom,
    polarAngle: controls.polarAngle,
    fogNear: fog.near,
    fogFar: fog.far,
  }

  return gsap.to(state, {
    x: aim[0],
    y: aim[1],
    z: aim[2],
    zoom: focus ? settledZoom * focus.focusZoom : settledZoom,
    polarAngle: focus ? cameraFocusConfig.polarAngle : cameraConfig.polarAngle,
    fogNear: focus ? cameraFocusConfig.fogNear : fogConfig.fogNear,
    fogFar: focus ? cameraFocusConfig.fogFar : fogConfig.fogFar,
    duration: cameraFocusConfig.durationSeconds,
    ease: 'power2.inOut',
    onUpdate() {
      controls.setTarget(state.x, state.y, state.z, false)
      controls.zoomTo(state.zoom, false)
      controls.rotateTo(controls.azimuthAngle, state.polarAngle, false)

      fog.near = state.fogNear
      fog.far = state.fogFar
    },
    onComplete() {
      if (!focus) {
        controls.maxPolarAngle = cameraConfig.polarAngle
      }
    },
  })
}
