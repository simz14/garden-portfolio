import { paletteConfig } from '../../../../config/garden'
import { shedPotConfig } from '../../../../config/shed'
import { useResources } from '../../../../context/resources'
import { createClump } from '../../../../utils/geometry'

export function PottedPlant({
  at,
  color,
  size = 1,
  getRandom,
}: {
  at: [number, number, number]
  color: string
  size?: number
  getRandom: () => number
}) {
  const { getMatteMaterial, canopies } = useResources()
  const [x, y, z] = at
  const foliage = createClump(
    getRandom,
    [x, y + 0.23 * size, z],
    shedPotConfig.foliageRadius * size,
  )
  const shape = canopies[Math.floor(getRandom() * canopies.length)]

  return (
    <>
      <mesh
        material={getMatteMaterial(paletteConfig.pot)}
        position={[x, y + 0.085 * size, z]}
        scale={size}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            shedPotConfig.radiusTop,
            shedPotConfig.radiusBottom,
            shedPotConfig.height,
            shedPotConfig.segments,
          ]}
        />
      </mesh>

      <mesh
        geometry={shape}
        material={getMatteMaterial(color)}
        position={foliage.position}
        rotation={foliage.rotation}
        scale={foliage.scale}
        castShadow
        receiveShadow
      />
    </>
  )
}
