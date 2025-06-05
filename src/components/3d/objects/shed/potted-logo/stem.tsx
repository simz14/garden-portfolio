import { logoFlowerConfig } from '../../../../../config/logos'
import { useResources } from '../../../../../context/resources'

const sides = [-1, 1]

export function Stem() {
  const { ball, getMatteMaterial } = useResources()
  const material = getMatteMaterial(logoFlowerConfig.stemColor)

  return (
    <>
      <mesh material={material} position-y={logoFlowerConfig.headHeight / 2} castShadow>
        <cylinderGeometry
          args={[
            logoFlowerConfig.stalkRadiusTop,
            logoFlowerConfig.stalkRadiusBottom,
            logoFlowerConfig.headHeight,
            logoFlowerConfig.stalkSegments,
          ]}
        />
      </mesh>

      {sides.map((side) => (
        <mesh
          key={side}
          geometry={ball}
          material={material}
          position={[
            side * logoFlowerConfig.leafOffset,
            logoFlowerConfig.leafHeight + side * logoFlowerConfig.leafRise,
            0,
          ]}
          rotation-z={side * logoFlowerConfig.leafTilt}
          scale={logoFlowerConfig.leafScale}
          castShadow
        />
      ))}
    </>
  )
}
