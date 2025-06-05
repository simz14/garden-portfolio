import { Instance, Instances } from '@react-three/drei'
import { paletteConfig } from '../../../../config/garden'
import { shedConfig, shedPotStackConfig } from '../../../../config/shed'
import { getWorldOffset } from '../../../../utils/garden'

const shedOriginX = getWorldOffset(shedConfig.x + shedConfig.width / 2)
const shedOriginZ = getWorldOffset(shedConfig.y + shedConfig.depth / 2)

function createPots() {
  return Array.from({ length: shedPotStackConfig.count }, (_, index) => {
    const column = index % shedPotStackConfig.perRow
    const row = Math.floor(index / shedPotStackConfig.perRow)

    return {
      key: index,
      position: [
        getWorldOffset(shedPotStackConfig.origin[0] + column * shedPotStackConfig.spacing) -
          shedOriginX,
        shedPotStackConfig.restingHeight,
        getWorldOffset(shedPotStackConfig.origin[1] + row * shedPotStackConfig.spacing) -
          shedOriginZ,
      ] as [number, number, number],
    }
  })
}

const pots = createPots()

export function PotStack() {
  return (
    <Instances
      frustumCulled={false}
      limit={pots.length}
      range={pots.length}
      castShadow
      receiveShadow
    >
      <cylinderGeometry
        args={[
          shedPotStackConfig.radiusTop,
          shedPotStackConfig.radiusBottom,
          shedPotStackConfig.height,
          shedPotStackConfig.segments,
        ]}
      />
      <meshLambertNodeMaterial color={paletteConfig.pot} />

      {pots.map((pot) => (
        <Instance key={pot.key} position={pot.position} />
      ))}
    </Instances>
  )
}
