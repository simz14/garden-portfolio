import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import type { WebGPURenderer } from 'three/webgpu'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { gardenConfig } from '../../../../config/garden'
import { lawnConfig } from '../../../../config/terrain'
import { useResources } from '../../../../context/resources'

const halfGrid = gardenConfig.gridSize / 2
const halfThickness = lawnConfig.colliderThickness / 2

export function Lawn() {
  const { ground } = useResources()
  // r3f still types the renderer as the webgl one, the canvas hands over a
  // node renderer that reports its anisotropy limit off the backend instead
  const renderer = useThree((state) => state.gl as unknown as WebGPURenderer)

  useEffect(() => {
    if (!ground) {
      return
    }

    ground.anisotropy = renderer.getMaxAnisotropy()
    ground.needsUpdate = true
  }, [ground, renderer])

  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position-y={lawnConfig.height} receiveShadow>
        <planeGeometry args={[gardenConfig.gridSize, gardenConfig.gridSize]} />
        <meshLambertNodeMaterial map={ground} />
      </mesh>

      {/* Sunk so its top face lands on y=0, and no wider than the island, so
          walking past the edge means walking off it. */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[halfGrid, halfThickness, halfGrid]}
          position={[0, -halfThickness, 0]}
        />
      </RigidBody>
    </>
  )
}
