import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'
import { paletteConfig } from '../../../../config/garden'
import { seedConfig } from '../../../../config/random'
import { shedBenchConfig, shedConfig, shedTrayConfig } from '../../../../config/shed'
import { useResources } from '../../../../context/resources'
import { createClump } from '../../../../utils/geometry'
import { createRandom } from '../../../../utils/random'

const halfWidth = shedConfig.width / 2
const halfDepth = shedConfig.depth / 2
const benchTop =
  shedConfig.floorHeight + shedBenchConfig.height + shedBenchConfig.topThickness

function createTrays() {
  const getRandom = createRandom(seedConfig.shed)

  return Array.from({ length: shedTrayConfig.count }, (_, tray) => {
    const x = -halfWidth + 0.3 + tray * shedTrayConfig.spacing
    const z = -halfDepth + 0.24

    const seedlings = Array.from({ length: shedTrayConfig.seedlingCount }, (_, seedling) => {
      const column = seedling % shedTrayConfig.seedlingsPerRow
      const row = Math.floor(seedling / shedTrayConfig.seedlingsPerRow)

      return {
        key: `${tray}-${seedling}`,
        color:
          shedTrayConfig.seedlingColors[seedling % shedTrayConfig.seedlingColors.length],
        ...createClump(
          getRandom,
          [
            x + 0.14 + column * shedTrayConfig.seedlingSpacing[0],
            benchTop + 0.16,
            z + 0.14 + row * shedTrayConfig.seedlingSpacing[1],
          ],
          shedTrayConfig.seedlingRadius,
        ),
      }
    })

    return { key: tray, x, z, seedlings }
  })
}

export function SeedTrays() {
  const { box, leaf, getMatteMaterial } = useResources()
  const trays = useMemo(createTrays, [])
  const seedlings = trays.flatMap((tray) => tray.seedlings)

  return (
    <>
      {trays.map((tray) => (
        <group key={tray.key}>
          <mesh
            geometry={box}
            material={getMatteMaterial(shedTrayConfig.color)}
            position={[
              tray.x + shedTrayConfig.size[0] / 2,
              benchTop + shedTrayConfig.size[1] / 2,
              tray.z + shedTrayConfig.size[2] / 2,
            ]}
            scale={shedTrayConfig.size}
            castShadow
            receiveShadow
          />

          <mesh
            geometry={box}
            material={getMatteMaterial(paletteConfig.soil)}
            position={[
              tray.x + shedTrayConfig.size[0] / 2,
              benchTop + shedTrayConfig.soilBase + shedTrayConfig.soilSize[1] / 2,
              tray.z + shedTrayConfig.size[2] / 2,
            ]}
            scale={shedTrayConfig.soilSize}
          />
        </group>
      ))}

      <Instances
        frustumCulled={false}
        geometry={leaf}
        limit={seedlings.length}
        range={seedlings.length}
        castShadow
        receiveShadow
      >
        <meshLambertNodeMaterial />

        {seedlings.map((seedling) => (
          <Instance
            key={seedling.key}
            color={seedling.color}
            position={seedling.position}
            rotation={seedling.rotation}
            scale={seedling.scale}
          />
        ))}
      </Instances>
    </>
  )
}
