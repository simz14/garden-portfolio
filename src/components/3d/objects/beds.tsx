import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { bedConfig } from '../../../config/beds'
import { obstacleConfig } from '../../../config/garden'
import { useZone } from '../../../hooks/zone'
import { getWorldOffset } from '../../../utils/garden'
import { Bed } from './beds/bed'
import { HotspotId } from '../../../config/hotspots'

const halfWall = obstacleConfig.wallHeight / 2
const halfBed = bedConfig.size / 2

export function Beds() {
  const zone = useZone(HotspotId.Projects)

  return (
    <group {...zone}>
      {bedConfig.beds.map((bed, index) => (
        <Bed key={`${bed.x},${bed.y}`} bed={bed} index={index} />
      ))}

      <RigidBody type="fixed" colliders={false}>
        {bedConfig.beds.map((bed) => (
          <CuboidCollider
            key={`${bed.x},${bed.y}`}
            args={[halfBed, halfWall, halfBed]}
            position={[
              getWorldOffset(bed.x) + halfBed,
              halfWall,
              getWorldOffset(bed.y) + halfBed,
            ]}
          />
        ))}
      </RigidBody>
    </group>
  )
}
