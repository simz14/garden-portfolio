import { useEffect, useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'
import { wildflowerConfig } from '../../../../config/decor'
import { seedConfig } from '../../../../config/random'
import { useResources } from '../../../../context/resources'
import { createFlower } from '../../../../utils/flowers'
import { getWorldOffset } from '../../../../utils/garden'
import { createRandom } from '../../../../utils/random'
import { FlowerKind } from '../../../../config/beds'

function createPatches() {
  const getRandom = createRandom(seedConfig.decor + wildflowerConfig.seedOffset)
  const piles = wildflowerConfig.colors.map(() => [] as {
    key: string
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
  }[])

  wildflowerConfig.patches.forEach(([patchX, patchY, count], patchIndex) => {
    for (let index = 0; index < count; index += 1) {
      const pile = piles[Math.floor(getRandom() * piles.length)]
      const spread =
        wildflowerConfig.minSpread + getRandom() * wildflowerConfig.spreadSwing
      const angle = getRandom() * Math.PI * 2
      const size = wildflowerConfig.minScale + getRandom() * wildflowerConfig.scaleSwing

      pile.push({
        key: `${patchIndex}-${index}`,
        position: [
          getWorldOffset(patchX) + Math.cos(angle) * spread,
          0,
          getWorldOffset(patchY) + Math.sin(angle) * spread,
        ],
        rotation: [
          0,
          getRandom() * Math.PI * 2,
          (getRandom() - 0.5) * wildflowerConfig.tiltSwing,
        ],
        scale: [size, size, size],
      })
    }
  })

  return wildflowerConfig.colors.map((colors, index) => ({
    key: colors.petal,
    geometry: createFlower(FlowerKind.Field, colors),
    entries: piles[index],
  }))
}

export function Wildflowers() {
  const { flowerMaterial } = useResources()
  const patches = useMemo(createPatches, [])

  useEffect(() => {
    return function disposePatches() {
      for (const patch of patches) {
        patch.geometry.dispose()
      }
    }
  }, [patches])

  return (
    <>
      {patches.map((patch) => (
        <Instances
          frustumCulled={false}
          key={patch.key}
          geometry={patch.geometry}
          material={flowerMaterial}
          limit={Math.max(patch.entries.length, 1)}
          range={patch.entries.length}
          castShadow
        >
          {patch.entries.map((entry) => (
            <Instance
              key={entry.key}
              position={entry.position}
              rotation={entry.rotation}
              scale={entry.scale}
            />
          ))}
        </Instances>
      ))}
    </>
  )
}
