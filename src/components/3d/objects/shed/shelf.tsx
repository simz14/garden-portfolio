import { useMemo } from 'react'
import { seedConfig } from '../../../../config/random'
import { shedConfig, shedShelfConfig } from '../../../../config/shed'
import { useResources } from '../../../../context/resources'
import { createRandom } from '../../../../utils/random'
import { PottedPlant } from './potted-plant'

const halfWidth = shedConfig.width / 2
const halfDepth = shedConfig.depth / 2
const shelfHeight = shedConfig.floorHeight + shedConfig.shelfHeight
const shelfWidth = shedConfig.width - 0.3
const shelfZ = -halfDepth + 0.35

export function Shelf() {
  const { box, getMatteMaterial } = useResources()
  const getRandom = useMemo(() => createRandom(seedConfig.decor), [])

  return (
    <>
      <mesh
        geometry={box}
        material={getMatteMaterial(shedShelfConfig.color)}
        position={[0, shelfHeight + shedShelfConfig.thickness / 2, shelfZ]}
        scale={[shelfWidth, shedShelfConfig.thickness, shedShelfConfig.depth]}
        castShadow
        receiveShadow
      />

      {Array.from({ length: shedShelfConfig.potCount }, (_, index) => (
        <PottedPlant
          key={index}
          at={[
            -halfWidth + 0.42 + index * shedShelfConfig.potSpacing,
            shelfHeight + shedShelfConfig.thickness,
            shelfZ,
          ]}
          color={shedShelfConfig.potColors[index % shedShelfConfig.potColors.length]}
          size={shedShelfConfig.potSize}
          getRandom={getRandom}
        />
      ))}
    </>
  )
}
