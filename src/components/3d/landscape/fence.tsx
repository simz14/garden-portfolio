import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { gardenConfig, obstacleConfig } from '../../../config/garden'
import { fenceConfig } from '../../../config/terrain'
import { getPostEdge } from '../../../utils/fence'
import { Posts } from './fence/posts'
import { Rails } from './fence/rails'

const half = gardenConfig.gridSize / 2
const halfWall = obstacleConfig.wallHeight / 2
const halfBarrier = fenceConfig.barrierThickness / 2

const barrier = getPostEdge() + fenceConfig.postWidth / 2 - halfBarrier

export function Fence() {
  return (
    <>
      <Posts />
      <Rails />

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[half, halfWall, halfBarrier]} position={[0, halfWall, barrier]} />
        <CuboidCollider args={[halfBarrier, halfWall, half]} position={[barrier, halfWall, 0]} />
      </RigidBody>
    </>
  )
}
