import { useRef } from 'react'
import type { DirectionalLight, HemisphereLight } from 'three'
import { CameraControls, OrthographicCamera } from '@react-three/drei'
import { cameraConfig, fogConfig, lightConfig, shadowConfig } from '../../config/scene'
import {
  setIsCameraDragging,
  useCameraFollow,
  useCameraHome,
  useCameraMoves,
} from '../../hooks/camera'
import { useWind } from '../../hooks/wind'
import { Fence } from './landscape/fence'
import { Ground } from './landscape/ground'
import { Path } from './landscape/path'
import { Beds } from './objects/beds'
import { WateringCan } from './objects/watering-can'
import { Decor } from './objects/decor'
import { Gardener } from './objects/gardener'
import { HotspotRings } from './objects/hotspot-rings'
import { Mailbox } from './objects/mailbox'
import { Oak } from './objects/oak'
import { Shed } from './objects/shed'
import { useSceneControls } from '../../hooks/scene-controls'

export function Scene() {
  const sunRef = useRef<DirectionalLight>(null)
  const skyRef = useRef<HemisphereLight>(null)

  useCameraHome()
  useCameraMoves()
  useCameraFollow()
  useWind()
  useSceneControls(sunRef, skyRef)

  return (
    <>
      <OrthographicCamera makeDefault near={cameraConfig.near} far={cameraConfig.far} />

      <CameraControls
        makeDefault
        smoothTime={cameraConfig.smoothTime}
        truckSpeed={0}
        dollySpeed={0}
        onControlStart={() => setIsCameraDragging(false)}
        onControl={() => setIsCameraDragging(true)}
        onControlEnd={() => requestAnimationFrame(() => setIsCameraDragging(false))}
      />

      <fog
        attach="fog"
        args={[fogConfig.fogColor, fogConfig.fogNear, fogConfig.fogFar]}
      />

      <hemisphereLight
        ref={skyRef}
        args={[
          lightConfig.hemisphere.skyColor,
          lightConfig.hemisphere.groundColor,
          lightConfig.hemisphere.intensity,
        ]}
      />

      <directionalLight
        ref={sunRef}
        color={lightConfig.directional.color}
        intensity={lightConfig.directional.intensity}
        position={lightConfig.directional.position}
        castShadow
        shadow-mapSize={[shadowConfig.highMapSize, shadowConfig.highMapSize]}
        shadow-camera-left={-shadowConfig.area}
        shadow-camera-right={shadowConfig.area}
        shadow-camera-top={shadowConfig.area}
        shadow-camera-bottom={-shadowConfig.area}
        shadow-camera-near={shadowConfig.near}
        shadow-camera-far={shadowConfig.far}
        shadow-bias={shadowConfig.bias}
        shadow-normalBias={shadowConfig.normalBias}
      />

      <Ground />
      <Path />
      <Fence />

      <Oak />
      <Shed />
      <Beds />
      <WateringCan />
      <Mailbox />
      <Decor />
      <Gardener />

      <HotspotRings />
    </>
  )
}
