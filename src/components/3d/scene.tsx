import { OrbitControls } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { lightConfig, shadowConfig } from '../../config/scene'

export function Scene() {
  return (
    <>
      <OrbitControls />

      <hemisphereLight
        args={[
          lightConfig.hemisphere.skyColor,
          lightConfig.hemisphere.groundColor,
          lightConfig.hemisphere.intensity,
        ]}
      />

      <directionalLight
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
        <planeGeometry args={[24, 24]} />
        <meshLambertNodeMaterial color="#568f42" />
      </mesh>

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[12, 0.25, 12]} position={[0, 0.25, 0]} />
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
