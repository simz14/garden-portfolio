import { useRef } from 'react'
import { useThree } from '@react-three/fiber'
import type { RefObject } from 'react'
import type { DirectionalLight, HemisphereLight } from 'three'
import { gardenerWalkConfig } from '../config/gardener'
import { hoverConfig } from '../config/hotspots'
import { pollenConfig } from '../config/ambience'
import {
  CameraView,
  cameraConfig,
  cameraFocusConfig,
  fogConfig,
  lightConfig,
  shadowConfig,
} from '../config/scene'
import { useCameraControls, useSceneFog } from './camera'
import { getCameraView, setCameraView } from './camera-view'
import { getDebugState, setDebugState } from './debug'
import { getSky, setSky } from './sky'
import { useDebugFolder } from './tweakpane'
import { getFittedZoom } from '../utils/camera'

export function useSceneControls(
  sunRef: RefObject<DirectionalLight | null>,
  skyRef: RefObject<HemisphereLight | null>,
) {
  const controls = useCameraControls()
  const fog = useSceneFog()
  const size = useThree((state) => state.size)

  // the folders are built once, so the change handlers read the live scene
  // through a ref instead of the values they closed over on the first frame
  const sceneRef = useRef({ controls, fog, size })

  sceneRef.current = { controls, fog, size }

  useDebugFolder('Helpers', (folder) => {
    const toggles = getDebugState()

    folder
      .addBinding(toggles, 'isFpsVisible', { label: 'show fps' })
      .on('change', (event) => setDebugState({ isFpsVisible: event.value }))

    folder
      .addBinding(toggles, 'isPhysicsVisible', { label: 'physics wireframe' })
      .on('change', (event) => setDebugState({ isPhysicsVisible: event.value }))

    folder
      .addBinding(toggles, 'isWireframeVisible', { label: 'object wireframe' })
      .on('change', (event) => setDebugState({ isWireframeVisible: event.value }))
  })

  useDebugFolder('Camera', (folder) => {
    const view = { current: getCameraView() }

    folder
      .addBinding(view, 'current', {
        label: 'view',
        options: {
          isometric: CameraView.Isometric,
          'top down': CameraView.Top,
        },
      })
      .on('change', (event) => setCameraView(event.value))

    function applyCamera() {
      const { controls, size } = sceneRef.current

      if (!controls) {
        return
      }

      controls.minAzimuthAngle = cameraConfig.azimuth - cameraConfig.azimuthRange
      controls.maxAzimuthAngle = cameraConfig.azimuth + cameraConfig.azimuthRange

      // the limits have to open before rotateTo, or the new tilt is clamped away
      controls.minPolarAngle = Math.min(cameraFocusConfig.polarAngle, cameraConfig.polarAngle)
      controls.maxPolarAngle = Math.max(cameraFocusConfig.polarAngle, cameraConfig.polarAngle)

      controls.dollyTo(cameraConfig.distance, true)
      controls.rotateTo(controls.azimuthAngle, cameraConfig.polarAngle, true)
      controls.zoomTo(getFittedZoom(size.width, size.height), true)
    }

    folder
      .addBinding(cameraConfig, 'distance', { min: 10, max: 90, step: 0.5 })
      .on('change', applyCamera)

    folder
      .addBinding(cameraConfig, 'polarAngle', { label: 'tilt', min: 0.2, max: 1.5, step: 0.01 })
      .on('change', applyCamera)

    folder
      .addBinding(cameraConfig, 'azimuthRange', { label: 'drag range', min: 0, max: 1.6, step: 0.02 })
      .on('change', applyCamera)

    folder
      .addBinding(cameraConfig, 'fitWidth', { label: 'fit width', min: 12, max: 90, step: 0.5 })
      .on('change', applyCamera)

    folder
      .addBinding(cameraConfig, 'minFitHeight', { label: 'fit height', min: 8, max: 70, step: 0.5 })
      .on('change', applyCamera)

    folder
      .addBinding(cameraConfig, 'maxFitHeight', { label: 'fit height max', min: 12, max: 90, step: 0.5 })
      .on('change', applyCamera)
  })

  useDebugFolder('Sky', (folder) => {
    const sky = { ...getSky() }

    const colors = [
      ['horizonColor', 'horizon'],
      ['hazeColor', 'haze'],
      ['midColor', 'mid'],
      ['topColor', 'top'],
    ] as const

    for (const [key, label] of colors) {
      folder
        .addBinding(sky, key, { label, view: 'color' })
        .on('change', (event) => setSky({ [key]: event.value }))
    }

    folder
      .addBinding(sky, 'hazeStop', { label: 'haze at', min: 0.05, max: 0.9, step: 0.01 })
      .on('change', (event) => setSky({ hazeStop: event.value }))

    folder
      .addBinding(sky, 'midStop', { label: 'mid at', min: 0.1, max: 0.95, step: 0.01 })
      .on('change', (event) => setSky({ midStop: event.value }))
  })

  useDebugFolder('Fog', (folder) => {

    function applyFog() {
      const { fog } = sceneRef.current

      if (!fog) {
        return
      }

      fog.color.set(fogConfig.fogColor)
      fog.near = fogConfig.fogNear
      fog.far = fogConfig.fogFar
    }

    folder
      .addBinding(fogConfig, 'fogColor', { label: 'color', view: 'color' })
      .on('change', applyFog)

    folder
      .addBinding(fogConfig, 'fogNear', { label: 'near', min: 0, max: 160, step: 1 })
      .on('change', applyFog)

    folder
      .addBinding(fogConfig, 'fogFar', { label: 'far', min: 1, max: 240, step: 1 })
      .on('change', applyFog)
  })

  useDebugFolder('Lighting', (folder) => {

    function applySun() {
      const sun = sunRef.current

      if (!sun) {
        return
      }

      sun.color.set(lightConfig.directional.color)
      sun.intensity = lightConfig.directional.intensity
      sun.position.set(...lightConfig.directional.position)
    }

    function applySky() {
      const sky = skyRef.current

      if (!sky) {
        return
      }

      sky.color.set(lightConfig.hemisphere.skyColor)
      sky.groundColor.set(lightConfig.hemisphere.groundColor)
      sky.intensity = lightConfig.hemisphere.intensity
    }

    folder
      .addBinding(lightConfig.directional, 'intensity', { label: 'sun', min: 0, max: 6, step: 0.05 })
      .on('change', applySun)

    folder
      .addBinding(lightConfig.directional, 'color', { label: 'sun color', view: 'color' })
      .on('change', applySun)

    folder
      .addBinding(lightConfig.hemisphere, 'intensity', { label: 'ambient', min: 0, max: 6, step: 0.05 })
      .on('change', applySky)

    folder
      .addBinding(lightConfig.hemisphere, 'skyColor', { label: 'sky color', view: 'color' })
      .on('change', applySky)

    folder
      .addBinding(lightConfig.hemisphere, 'groundColor', { label: 'bounce color', view: 'color' })
      .on('change', applySky)
  })

  useDebugFolder('Shadows', (folder) => {

    function applyShadow() {
      const sun = sunRef.current

      if (!sun) {
        return
      }

      const camera = sun.shadow.camera

      sun.shadow.bias = shadowConfig.bias
      sun.shadow.normalBias = shadowConfig.normalBias

      camera.left = -shadowConfig.area
      camera.right = shadowConfig.area
      camera.top = shadowConfig.area
      camera.bottom = -shadowConfig.area
      camera.near = shadowConfig.near
      camera.far = shadowConfig.far
      camera.updateProjectionMatrix()
    }

    folder
      .addBinding(shadowConfig, 'bias', { min: -0.005, max: 0, step: 0.00005 })
      .on('change', applyShadow)

    folder
      .addBinding(shadowConfig, 'normalBias', { label: 'normal bias', min: 0, max: 0.2, step: 0.005 })
      .on('change', applyShadow)

    folder.addBinding(shadowConfig, 'area', { min: 6, max: 40, step: 0.5 }).on('change', applyShadow)
    folder.addBinding(shadowConfig, 'near', { min: 0.1, max: 40, step: 0.5 }).on('change', applyShadow)
    folder.addBinding(shadowConfig, 'far', { min: 10, max: 200, step: 1 }).on('change', applyShadow)
  })
  useDebugFolder('Gardener', (folder) => {
    folder.addBinding(gardenerWalkConfig, 'speed', { label: 'walk speed', min: 1, max: 16, step: 0.5 })
    folder.addBinding(gardenerWalkConfig, 'slowSpeed', { label: 'task speed', min: 1, max: 10, step: 0.2 })
    folder.addBinding(gardenerWalkConfig, 'turnRate', { label: 'turn rate', min: 1, max: 30, step: 0.5 })
  })

  useDebugFolder('Hotspots', (folder) => {
    folder.addBinding(hoverConfig, 'lift', { label: 'hover lift', min: 0, max: 1.2, step: 0.05 })
    folder.addBinding(hoverConfig, 'seconds', { label: 'hover secs', min: 0.05, max: 1.5, step: 0.01 })
    folder.addBinding(hoverConfig, 'ringOpacity', { label: 'ring opacity', min: 0, max: 1, step: 0.05 })
  })

  useDebugFolder('Pollen', (folder) => {
    folder.addBinding(pollenConfig, 'minSpeed', { label: 'min speed', min: 0, max: 2, step: 0.05 })
    folder.addBinding(pollenConfig, 'speedSwing', { label: 'speed swing', min: 0, max: 2, step: 0.05 })
    folder.addBinding(pollenConfig, 'opacity', { min: 0, max: 1, step: 0.05 })
    folder.addBinding(pollenConfig, 'minWander', { label: 'min wander', min: 0, max: 3, step: 0.05 })
    folder.addBinding(pollenConfig, 'wanderSwing', { label: 'wander swing', min: 0, max: 3, step: 0.05 })
  })
}
