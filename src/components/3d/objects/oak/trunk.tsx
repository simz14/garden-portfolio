import { paletteConfig } from '../../../../config/garden'
import { oakConfig } from '../../../../config/oak'
import { useResources } from '../../../../context/resources'

export function Trunk() {
  const { getMatteMaterial } = useResources()

  return (
    <>
      <mesh
        material={getMatteMaterial(paletteConfig.bark)}
        position-y={oakConfig.trunkHeight / 2}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            oakConfig.trunkRadiusTop,
            oakConfig.trunkRadiusBottom,
            oakConfig.trunkHeight,
            oakConfig.trunkSegments,
          ]}
        />
      </mesh>

      <mesh
        material={getMatteMaterial(oakConfig.flareColor)}
        position-y={oakConfig.flareCentreHeight}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            oakConfig.flareRadiusTop,
            oakConfig.flareRadiusBottom,
            oakConfig.flareHeight,
            oakConfig.trunkSegments,
          ]}
        />
      </mesh>
    </>
  )
}
