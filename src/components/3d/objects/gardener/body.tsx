import { useImperativeHandle, useRef } from 'react'
import type { Ref } from 'react'
import type { Mesh, Object3D } from 'three'
import { gardenerConfig, gardenerShapeConfig } from '../../../../config/gardener'
import { paletteConfig } from '../../../../config/garden'
import { useDebugState } from '../../../../hooks/debug'
import { useResources } from '../../../../context/resources'

export interface GardenerParts {
  skirt: Mesh
  arms: Object3D[]
  legs: Object3D[]
  hands: Object3D[]
}

const sides = [-1, 1]
const shape = gardenerShapeConfig

export function Body({ ref }: { ref: Ref<GardenerParts> }) {
  const { box, ball, getMatteMaterial, wireframeMaterial } = useResources()
  const { isWireframeVisible } = useDebugState()

  function paint(color: string) {
    return isWireframeVisible ? wireframeMaterial : getMatteMaterial(color)
  }

  const skirtRef = useRef<Mesh>(null)
  const armRefs = useRef<(Object3D | null)[]>([])
  const legRefs = useRef<(Object3D | null)[]>([])
  const handRefs = useRef<(Object3D | null)[]>([])

  const skin = paint(gardenerConfig.skinColor)
  const dress = paint(gardenerConfig.dressColor)
  const hair = paint(gardenerConfig.hairColor)

  useImperativeHandle(ref, () => {
    const isPresent = (part: Object3D | null): part is Object3D => part !== null

    return {
      skirt: skirtRef.current!,
      arms: armRefs.current.filter(isPresent),
      legs: legRefs.current.filter(isPresent),
      hands: handRefs.current.filter(isPresent),
    }
  }, [])

  return (
    <>
      <mesh ref={skirtRef} material={dress} position-y={gardenerConfig.skirtHeight} castShadow receiveShadow>
        <cylinderGeometry
          args={[shape.skirt.radiusTop, shape.skirt.radiusBottom, shape.skirt.height, shape.skirt.segments]}
        />
      </mesh>

      <mesh material={dress} position-y={shape.bodice.y} castShadow>
        <cylinderGeometry
          args={[shape.bodice.radiusTop, shape.bodice.radiusBottom, shape.bodice.height, shape.bodice.segments]}
        />
      </mesh>

      {sides.map((side, index) => (
        <group
          key={side}
          ref={(leg) => {
            legRefs.current[index] = leg
          }}
          position={[side * shape.leg.offset, shape.leg.y, 0]}
        >
          <mesh material={skin} position-y={-gardenerConfig.legLength / 2} castShadow>
            <cylinderGeometry
              args={[
                shape.leg.radius,
                shape.leg.radius * shape.leg.taper,
                gardenerConfig.legLength,
                shape.leg.segments,
              ]}
            />
          </mesh>

          <mesh
            geometry={box}
            material={paint(gardenerConfig.shoeColor)}
            position={shape.shoe.position}
            scale={shape.shoe.size}
          />
        </group>
      ))}

      {sides.map((side, index) => (
        <group key={side}>
          <group
            ref={(arm) => {
              armRefs.current[index] = arm
            }}
            position={[side * shape.arm.offset, shape.arm.y, 0]}
            rotation-z={side * gardenerConfig.armRestZ}
          >
            <mesh material={skin} position-y={-gardenerConfig.armLength / 2} castShadow>
              <capsuleGeometry
                args={[
                  shape.arm.radius,
                  gardenerConfig.armLength - shape.arm.radius * 2,
                  shape.arm.segments[0],
                  shape.arm.segments[1],
                ]}
              />
            </mesh>

            <mesh
              ref={(hand) => {
                handRefs.current[index] = hand
              }}
              material={skin}
              position-y={-gardenerConfig.armLength}
              castShadow
            >
              <sphereGeometry args={[shape.handRadius, 12, 10]} />
            </mesh>
          </group>

          <mesh material={dress} position={[side * shape.arm.offset, shape.arm.y, 0]} castShadow>
            <sphereGeometry args={[shape.shoulderRadius, 10, 8]} />
          </mesh>
        </group>
      ))}

      <mesh material={skin} position-y={shape.headY} castShadow>
        <sphereGeometry args={[shape.headRadius, 12, 10]} />
      </mesh>

      <mesh material={hair} position={shape.hairCap.position} scale={shape.hairCap.scale} castShadow>
        <sphereGeometry args={[shape.hairCap.radius, 12, 10]} />
      </mesh>

      <mesh geometry={ball} material={hair} position={shape.bun.position} scale={shape.bun.scale} castShadow />

      {sides.map((side) => (
        <mesh
          key={side}
          geometry={ball}
          material={hair}
          position={[side * shape.strand.offset, shape.strand.y, shape.strand.z]}
          scale={shape.strand.scale}
          castShadow
        />
      ))}

      <mesh material={paint(gardenerConfig.hatBrimColor)} position-y={shape.hatBrim.y} castShadow>
        <cylinderGeometry
          args={[shape.hatBrim.radius, shape.hatBrim.radius, shape.hatBrim.height, shape.hatBrim.segments]}
        />
      </mesh>

      <mesh material={paint(gardenerConfig.hatCrownColor)} position-y={shape.hatCrown.y} castShadow>
        <cylinderGeometry
          args={[
            shape.hatCrown.radiusTop,
            shape.hatCrown.radiusBottom,
            shape.hatCrown.height,
            shape.hatCrown.segments,
          ]}
        />
      </mesh>

      <mesh material={paint(paletteConfig.accent)} position-y={shape.hatRibbon.y}>
        <cylinderGeometry
          args={[
            shape.hatRibbon.radiusTop,
            shape.hatRibbon.radiusBottom,
            shape.hatRibbon.height,
            shape.hatRibbon.segments,
          ]}
        />
      </mesh>
    </>
  )
}
