import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { obstacleConfig, paletteConfig } from '../../../config/garden'
import { shedConfig } from '../../../config/shed'
import { useResources } from '../../../context/resources'
import { useZone } from '../../../hooks/zone'
import { getWorldOffset } from '../../../utils/garden'
import { Display } from './shed/display'
import { Door } from './shed/door'
import { Walls } from './shed/walls'
import { Lamp } from './shed/lamp'
import { PotStack } from './shed/pot-stack'
import { Roof } from './shed/roof'
import { SeedTrays } from './shed/seed-trays'
import { Shelf } from './shed/shelf'
import { Workbench } from './shed/workbench'
import { HotspotId } from '../../../config/hotspots'

const halfWidth = shedConfig.width / 2
const halfDepth = shedConfig.depth / 2
const halfWall = obstacleConfig.wallHeight / 2

const baseSize: [number, number, number] = [
  shedConfig.width + shedConfig.baseOverhang * 2,
  shedConfig.floorHeight,
  shedConfig.depth + shedConfig.baseOverhang * 2,
]

export function Shed() {
  const { box, getMatteMaterial } = useResources()
  const zone = useZone(HotspotId.Tech)

  return (
    <group
      {...zone}
      position={[
        getWorldOffset(shedConfig.x + halfWidth),
        0,
        getWorldOffset(shedConfig.y + halfDepth),
      ]}
    >
      <mesh
        geometry={box}
        material={getMatteMaterial(paletteConfig.base)}
        position-y={shedConfig.floorHeight / 2}
        scale={baseSize}
        receiveShadow
      />

      <Walls />
      <Door />
      <Roof />
      <Lamp />

      <Workbench
        at={[-halfWidth + 0.15, -halfDepth + 0.15]}
        size={[shedConfig.width - 0.3, 0.62]}
      />
      <Workbench
        at={[-halfWidth + 0.15, -halfDepth + 0.85]}
        size={[0.62, shedConfig.depth - 1]}
      />

      <SeedTrays />
      <Shelf />
      <Display />
      <PotStack />

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[
            halfWidth + shedConfig.footprintMargin,
            halfWall,
            halfDepth + shedConfig.footprintMargin,
          ]}
          position={[0, halfWall, 0]}
        />
      </RigidBody>
    </group>
  )
}
