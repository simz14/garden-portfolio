import { useEffect, useRef } from 'react'
import type { DirectionalLight, HemisphereLight } from 'three'
import { CameraControls, OrthographicCamera } from '@react-three/drei'
import { cameraConfig, fogConfig, lightConfig, shadowConfig } from '../../config/scene'
import {
  setIsCameraDragging,
  useCameraFollow,
  useCameraHome,
  useCameraMoves,
  useCameraViewPreset,
} from '../../hooks/camera'
import { useGarden } from '../../hooks/garden'
import { QualityLevel, useQualityLevel } from '../../hooks/quality'
import { useWind } from '../../hooks/wind'
import { BedLabels } from './labels/bed-labels'
import { TechStack } from './labels/tech-stack'
import { HotspotMarkers } from './labels/hotspot-markers'
import { Fence } from './landscape/fence'
import { Ground } from './landscape/ground'
import { Path } from './landscape/path'
import { Beds } from './objects/beds'
import { WateringCan } from './objects/watering-can'
import { Decor } from './objects/decor'
import { Gardener } from './objects/gardener'
import { HotspotRings } from './objects/hotspot-rings'
import { Bird } from './objects/bird'
import { Butterflies } from './objects/butterflies'
import { Pollen } from './objects/pollen'
import { Mailbox } from './objects/mailbox'
import { Oak } from './objects/oak'
import { Shed } from './objects/shed'
import { useSceneControls } from '../../hooks/scene-controls'

export function Scene() {
  const qualityLevel = useQualityLevel()
  const hasEntered = useGarden((state) => state.hasEntered)
  const sunRef = useRef<DirectionalLight>(null)
  const skyRef = useRef<HemisphereLight>(null)

  useCameraHome()
  useCameraViewPreset()
  useCameraMoves()
  useCameraFollow()
  useWind()

  const shadowMapSize =
    qualityLevel === QualityLevel.High ? shadowConfig.highMapSize : shadowConfig.lowMapSize
  useEffect(() => {
    sunRef.current?.shadow.camera.updateProjectionMatrix()
  }, [shadowMapSize])
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
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-camera-left={-shadowConfig.area}
        shadow-camera-right={shadowConfig.area}
        shadow-camera-top={shadowConfig.area}
        shadow-camera-bottom={-shadowConfig.area}
        shadow-camera-near={shadowConfig.near}
        shadow-camera-far={shadowConfig.far}
        shadow-bias={shadowConfig.bias}
        shadow-normalBias={shadowConfig.normalBias}
      />

      {/* the intro sits on the empty sky -- the island still loads and compiles
          behind it, it just stays off screen until she asks to enter */}
      <group visible={hasEntered}>
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
      <Pollen />
      <Butterflies />
      <Bird />
    </>
      </group>

      <HotspotMarkers />
      <BedLabels />
      <TechStack />
    </>
  )
}
