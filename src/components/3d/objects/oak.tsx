import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { obstacleConfig } from '../../../config/garden'
import { oakConfig } from '../../../config/oak'
import { getWorldOffset } from '../../../utils/garden'
import { Branches } from './oak/branches'
import { Canopy } from './oak/canopy'
import { Leaves } from './oak/leaves'
import { Trunk } from './oak/trunk'

const halfWall = obstacleConfig.wallHeight / 2

export function Oak() {
  return (
    <group position={[getWorldOffset(oakConfig.x), 0, getWorldOffset(oakConfig.y)]}>
      <Trunk />
      <Branches />
      <Canopy />
      <Leaves />

      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[halfWall, oakConfig.collisionRadius]} position={[0, halfWall, 0]} />
        <CylinderCollider
          args={[halfWall, oakConfig.branchCollisionRadius]}
          position={[
            oakConfig.branchCollisionOffset,
            halfWall,
            -oakConfig.branchCollisionOffset,
          ]}
        />
      </RigidBody>
    </group>
  )
}
