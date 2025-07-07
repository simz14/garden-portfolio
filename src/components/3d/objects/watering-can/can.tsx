import type { Ref } from 'react'
import type { Group } from 'three'
import { wateringCanConfig } from '../../../../config/watering-can'
import { useResources } from '../../../../context/resources'

export function Can({ ref }: { ref: Ref<Group> }) {
  const { getMatteMaterial } = useResources()
  const tinMaterial = getMatteMaterial(wateringCanConfig.tinColor)
  const { body, rim, handle, grip, spoutShape, rose } = wateringCanConfig

  return (
    <group
      ref={ref}
      position={wateringCanConfig.rest}
      rotation-y={wateringCanConfig.restYaw}
    >
      <mesh
        material={getMatteMaterial(wateringCanConfig.bodyColor)}
        position-y={body.y}
        castShadow
      >
        <cylinderGeometry
          args={[body.radiusTop, body.radiusBottom, body.height, body.segments]}
        />
      </mesh>

      <mesh material={tinMaterial} position-y={rim.y}>
        <cylinderGeometry args={[rim.radius, rim.radius, rim.height, rim.segments]} />
      </mesh>

      <mesh material={tinMaterial} position-y={handle.y} castShadow>
        <torusGeometry args={[handle.radius, handle.tube, 5, 12, Math.PI]} />
      </mesh>

      <mesh material={tinMaterial} position={grip.at} rotation-z={-Math.PI / 2}>
        <torusGeometry args={[grip.radius, grip.tube, 5, 10, grip.arc]} />
      </mesh>

      <mesh
        material={tinMaterial}
        position={spoutShape.at}
        rotation-z={-wateringCanConfig.spoutAngle}
        castShadow
      >
        <cylinderGeometry
          args={[
            spoutShape.radiusTop,
            spoutShape.radiusBottom,
            spoutShape.length,
            spoutShape.segments,
          ]}
        />
      </mesh>

      <mesh
        material={getMatteMaterial(wateringCanConfig.roseColor)}
        position={rose.at}
        rotation-z={-wateringCanConfig.spoutAngle}
      >
        <cylinderGeometry
          args={[rose.radiusTop, rose.radiusBottom, rose.height, rose.segments]}
        />
      </mesh>
    </group>
  )
}
