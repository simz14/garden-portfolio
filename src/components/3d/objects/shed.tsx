import { paletteConfig } from '../../../config/garden'
import { shedConfig } from '../../../config/shed'
import { useResources } from '../../../context/resources'
import { getWorldOffset } from '../../../utils/garden'
import { Door } from './shed/door'
import { Roof } from './shed/roof'
import { Walls } from './shed/walls'
import { Workbench } from './shed/workbench'

const halfWidth = shedConfig.width / 2
const halfDepth = shedConfig.depth / 2

const baseSize: [number, number, number] = [
  shedConfig.width + shedConfig.baseOverhang * 2,
  shedConfig.floorHeight,
  shedConfig.depth + shedConfig.baseOverhang * 2,
]

export function Shed() {
  const { box, getMatteMaterial } = useResources()

  return (
    <group
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

      <Workbench
        at={[-halfWidth + 0.15, -halfDepth + 0.15]}
        size={[shedConfig.width - 0.3, 0.62]}
      />
      <Workbench
        at={[-halfWidth + 0.15, -halfDepth + 0.85]}
        size={[0.62, shedConfig.depth - 1]}
      />
    </group>
  )
}
