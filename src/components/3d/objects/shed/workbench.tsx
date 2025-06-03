import { shedConfig, shedBenchConfig } from '../../../../config/shed'
import { useResources } from '../../../../context/resources'

export function Workbench({
  at: [x, z],
  size: [width, depth],
}: {
  at: [number, number]
  size: [number, number]
}) {
  const { box, getMatteMaterial } = useResources()

  const legMid = shedConfig.floorHeight + shedBenchConfig.height / 2
  const inset = shedBenchConfig.legInset + shedBenchConfig.legWidth / 2

  const legs = [
    [x + inset, z + inset],
    [x + width - inset, z + inset],
    [x + inset, z + depth - inset],
    [x + width - inset, z + depth - inset],
  ]

  return (
    <>
      {legs.map(([legX, legZ]) => (
        <mesh
          key={`${legX},${legZ}`}
          geometry={box}
          material={getMatteMaterial(shedBenchConfig.legColor)}
          position={[legX, legMid, legZ]}
          scale={[
            shedBenchConfig.legWidth,
            shedBenchConfig.height,
            shedBenchConfig.legWidth,
          ]}
          castShadow
          receiveShadow
        />
      ))}

      <mesh
        geometry={box}
        material={getMatteMaterial(shedBenchConfig.topColor)}
        position={[
          x + width / 2,
          shedConfig.floorHeight + shedBenchConfig.height + shedBenchConfig.topThickness / 2,
          z + depth / 2,
        ]}
        scale={[width, shedBenchConfig.topThickness, depth]}
        castShadow
        receiveShadow
      />
    </>
  )
}
