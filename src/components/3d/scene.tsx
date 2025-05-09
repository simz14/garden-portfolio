import { OrbitControls } from '@react-three/drei'

export function Scene() {
  return (
    <>
      <OrbitControls />

      <hemisphereLight args={['#cfe3f2', '#3f6236', 0.95]} />
      <directionalLight color="#ffeec2" intensity={2.6} position={[18, 26, 10]} />

      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertNodeMaterial color="#8a5c33" />
      </mesh>
    </>
  )
}
