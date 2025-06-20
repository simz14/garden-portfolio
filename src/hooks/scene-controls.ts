import { useRef } from 'react'
import type { RefObject } from 'react'
import type { DirectionalLight, HemisphereLight } from 'three'
import { gardenerWalkConfig } from '../config/gardener'
import { fogConfig, lightConfig, shadowConfig } from '../config/scene'
import { useSceneFog } from './camera'
import { getDebugState, setDebugState } from './debug'
import { useDebugFolder } from './tweakpane'

export function useSceneControls(
  sunRef: RefObject<DirectionalLight | null>,
  skyRef: RefObject<HemisphereLight | null>,
) {
  const fog = useSceneFog()

  // the folders are built once, so the change handlers read the live scene
  // through a ref instead of the values they closed over on the first frame
  const sceneRef = useRef({ fog })

  sceneRef.current = { fog }

  useDebugFolder('Helpers', (folder) => {
    const toggles = getDebugState()

    folder
      .addBinding(toggles, 'isPhysicsVisible', { label: 'physics wireframe' })
      .on('change', (event) => setDebugState({ isPhysicsVisible: event.value }))

    folder
      .addBinding(toggles, 'isWireframeVisible', { label: 'object wireframe' })
      .on('change', (event) => setDebugState({ isWireframeVisible: event.value }))
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
}
