import { paletteConfig } from '../../../config/garden'
import { shedConfig } from '../../../config/shed'
import { useResources } from '../../../context/resources'
import { getWorldOffset } from '../../../utils/garden'
import { Door } from './shed/door'
import { Roof } from './shed/roof'
import { Walls } from './shed/walls'

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
    </group>
  )
}
