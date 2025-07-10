import { paletteConfig } from '../../../../config/garden'
import { oakBenchConfig } from '../../../../config/oak'
import { useResources } from '../../../../context/resources'
import { getBenchFacing } from '../../../../utils/oak'

export function Bench() {
  const { box, getMatteMaterial } = useResources()
  const barkMaterial = getMatteMaterial(paletteConfig.bark)
  const benchMaterial = getMatteMaterial(paletteConfig.bench)

  return (
    <group position={oakBenchConfig.at} rotation-y={getBenchFacing() + Math.PI}>
      {oakBenchConfig.legPositions.map((position) => (
        <mesh
          key={position.join(',')}
          geometry={box}
          material={barkMaterial}
          position={position}
          scale={oakBenchConfig.legSize}
          castShadow
          receiveShadow
        />
      ))}

      <mesh
        geometry={box}
        material={benchMaterial}
        position={oakBenchConfig.seat.position}
        scale={oakBenchConfig.seat.size}
        castShadow
        receiveShadow
      />

      <mesh
        geometry={box}
        material={benchMaterial}
        position={oakBenchConfig.back.position}
        scale={oakBenchConfig.back.size}
        castShadow
        receiveShadow
      />
    </group>
  )
}
