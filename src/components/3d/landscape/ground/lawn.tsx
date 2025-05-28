import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { gardenConfig } from '../../../../config/garden'
import { lawnConfig } from '../../../../config/terrain'
import { useResources } from '../../../../context/resources'

const halfGrid = gardenConfig.gridSize / 2
const halfThickness = lawnConfig.colliderThickness / 2

export function Lawn() {
  const { ground } = useResources()
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
