import { useMemo } from 'react'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { shrubShapeConfig } from '../../../../config/decor'
import { obstacleConfig, paletteConfig, shrubConfig } from '../../../../config/garden'
import { seedConfig } from '../../../../config/random'
import { useResources } from '../../../../context/resources'
import { createClump } from '../../../../utils/geometry'
import { getWorldOffset } from '../../../../utils/garden'
import { createRandom } from '../../../../utils/random'

const halfWall = obstacleConfig.wallHeight / 2

function createShrubs(canopyCount: number) {
  const getRandom = createRandom(seedConfig.decor + shrubShapeConfig.seedOffset)

  return shrubConfig.positions.map(([gridX, gridY]) => ({
    key: `${gridX},${gridY}`,
    at: [getWorldOffset(gridX), 0, getWorldOffset(gridY)] as [number, number, number],
    mounds: shrubShapeConfig.mounds.map((mound, index) => ({
      key: index,
      ...createClump(getRandom, mound.at, mound.radius),
      color: paletteConfig.shrub[index % paletteConfig.shrub.length],
      shape: Math.floor(getRandom() * canopyCount),
    })),
    berries: Array.from({ length: shrubShapeConfig.berryCount }, (_, index) => ({
      key: index,
      ...createClump(
        getRandom,
        [
          (getRandom() - 0.5) * shrubShapeConfig.berrySpread,
          shrubShapeConfig.berryMinHeight + getRandom() * shrubShapeConfig.berryHeightSwing,
          (getRandom() - 0.5) * shrubShapeConfig.berrySpread,
        ],
        shrubShapeConfig.berryRadius,
      ),
    })),
  }))
}

export function Shrubs() {
  const { ball, canopies, getMatteMaterial } = useResources()
  const shrubs = useMemo(() => createShrubs(canopies.length), [canopies.length])

  return (
    <>
      {shrubs.map((shrub) => (
        <group key={shrub.key} position={shrub.at}>
          {shrub.mounds.map((mound) => (
            <mesh
              key={mound.key}
              geometry={canopies[mound.shape]}
              material={getMatteMaterial(mound.color)}
              position={mound.position}
              rotation={mound.rotation}
              scale={mound.scale}
              castShadow
              receiveShadow
            />
          ))}

          {shrub.berries.map((berry) => (
            <mesh
              key={berry.key}
              geometry={ball}
              material={getMatteMaterial(shrubShapeConfig.berryColor)}
              position={berry.position}
              rotation={berry.rotation}
              scale={berry.scale}
              castShadow
            />
          ))}
        </group>
      ))}

      <RigidBody type="fixed" colliders={false}>
        {shrubConfig.positions.map(([gridX, gridY]) => (
          <CylinderCollider
            key={`${gridX},${gridY}`}
            args={[halfWall, shrubConfig.radius]}
            position={[getWorldOffset(gridX), halfWall, getWorldOffset(gridY)]}
          />
        ))}
      </RigidBody>
    </>
  )
}
