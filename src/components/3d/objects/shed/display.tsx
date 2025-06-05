import { useMemo } from 'react'
import { seedConfig } from '../../../../config/random'
import {

  shedConfig,
  shedDisplayConfig,
  shedBenchConfig,
} from '../../../../config/shed'
import { useResources } from '../../../../context/resources'
import { createRandom } from '../../../../utils/random'
import { PottedLogo } from './potted-logo'
import { PottedPlant } from './potted-plant'

const halfWidth = shedConfig.width / 2
const halfDepth = shedConfig.depth / 2
const benchTop =
  shedConfig.floorHeight + shedBenchConfig.height + shedBenchConfig.topThickness

export function Display() {
  const { box, getMatteMaterial } = useResources()
  const getRandom = useMemo(() => createRandom(seedConfig.shed), [])

  const { crate, wateringCan } = shedDisplayConfig

  return (
    <>
      {shedDisplayConfig.benchItems.map((item, index) => {
        const at: [number, number, number] = [
          -halfWidth + shedDisplayConfig.benchRowInset,
          benchTop,
          -halfDepth +
            shedDisplayConfig.benchRowStart +
            index * shedDisplayConfig.benchRowSpacing,
        ]

        if (!item) {
          return (
            <PottedPlant
              key={index}
              at={at}
              color={
                shedDisplayConfig.benchPlantColors[
                  index === 0 ? 0 : shedDisplayConfig.benchPlantColors.length - 1
                ]
              }
              getRandom={getRandom}
            />
          )
        }

        return (
          <PottedLogo
            key={index}
            at={at}
            kind={item}
            size={shedDisplayConfig.benchLogoSize}
          />
        )
      })}

      {shedDisplayConfig.floorLogos.map((logo) => (
        <PottedLogo
          key={logo.kind}
          at={[halfWidth + logo.at[0], shedConfig.floorHeight, halfDepth + logo.at[1]]}
          kind={logo.kind}
          size={logo.size}
        />
      ))}

      <mesh
        geometry={box}
        material={getMatteMaterial(crate.color)}
        position={[
          halfWidth + crate.offset[0] + crate.size[0] / 2,
          shedConfig.floorHeight + crate.size[1] / 2,
          -halfDepth + crate.offset[1] + crate.size[2] / 2,
        ]}
        scale={crate.size}
        castShadow
        receiveShadow
      />

      <mesh
        material={getMatteMaterial(wateringCan.color)}
        position={[
          halfWidth + wateringCan.offset[0],
          shedConfig.floorHeight + wateringCan.height / 2,
          -halfDepth + wateringCan.offset[1],
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            wateringCan.radiusTop,
            wateringCan.radiusBottom,
            wateringCan.height,
            wateringCan.segments,
          ]}
        />
      </mesh>
    </>
  )
}
