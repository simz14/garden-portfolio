import { useRef } from 'react'
import type { DirectionalLight, HemisphereLight } from 'three'
import { CameraControls, OrthographicCamera } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { gardenConfig, paletteConfig } from '../../config/garden'
import { cameraConfig, fogConfig, lightConfig, shadowConfig } from '../../config/scene'
import { useCameraHome } from '../../hooks/camera'
import { useSceneControls } from '../../hooks/scene-controls'

const halfGrid = gardenConfig.gridSize / 2

export function Scene() {
  const sunRef = useRef<DirectionalLight>(null)
  const skyRef = useRef<HemisphereLight>(null)

  useCameraHome()
  useSceneControls(sunRef, skyRef)

  return (
    <>
      <OrthographicCamera makeDefault near={cameraConfig.near} far={cameraConfig.far} />

      <CameraControls makeDefault truckSpeed={0} dollySpeed={0} />

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

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[gardenConfig.gridSize, gardenConfig.gridSize]} />
        <meshLambertNodeMaterial color={paletteConfig.grass[0]} />
      </mesh>

      <RigidBody type="fixed" colliders={false}>
        {/* sunk so the top face lands on y=0 */}
        <CuboidCollider args={[halfGrid, 0.25, halfGrid]} position={[0, -0.25, 0]} />
      </RigidBody>

      <RigidBody position={[0, 6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertNodeMaterial color="#8a5c33" />
        </mesh>
      </RigidBody>
    </>
  )
}
