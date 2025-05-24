import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'
import { paletteConfig } from '../../../config/garden'
import { seedConfig } from '../../../config/random'
import { pathStoneConfig } from '../../../config/terrain'
import { createPathTiles, getWorldOffset } from '../../../utils/garden'
import { createRandom } from '../../../utils/random'

function createStones() {
  const getRandom = createRandom(seedConfig.stones)

  return [...createPathTiles()].map((tile) => {
    const [gridX, gridY] = tile.split(',').map(Number)
    const size = pathStoneConfig.minScale + getRandom() * pathStoneConfig.scaleRange

    return {
      tile,
      color: paletteConfig.stone[Math.floor(getRandom() * paletteConfig.stone.length)],
      position: [
        getWorldOffset(gridX) + 0.5 + (getRandom() - 0.5) * pathStoneConfig.scatter,
        pathStoneConfig.restingHeight,
        getWorldOffset(gridY) + 0.5 + (getRandom() - 0.5) * pathStoneConfig.scatter,
      ] as [number, number, number],
      rotation: [
        (getRandom() - 0.5) * pathStoneConfig.maxTilt,
        getRandom() * Math.PI * 2,
        (getRandom() - 0.5) * pathStoneConfig.maxTilt,
      ] as [number, number, number],
      scale: [size, 1, size] as [number, number, number],
    }
  })
}

export function Path() {
  const stones = useMemo(createStones, [])

  return (
    <Instances
      frustumCulled={false}
      limit={stones.length}
      range={stones.length}
      receiveShadow
    >
      <cylinderGeometry
        args={[
          pathStoneConfig.radiusTop,
          pathStoneConfig.radiusBottom,
          pathStoneConfig.thickness,
          pathStoneConfig.baseSegments,
        ]}
      />
      <meshLambertNodeMaterial />

      {stones.map((stone) => (
        <Instance
          key={stone.tile}
          color={stone.color}
          position={stone.position}
          rotation={stone.rotation}
          scale={stone.scale}
        />
      ))}
    </Instances>
  )
}
