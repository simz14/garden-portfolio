import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CapsuleGeometry, SphereGeometry, Vector3 } from 'three'
import type { Group } from 'three'
import { butterflyConfig } from '../../../../config/ambience'
import { useResources } from '../../../../context/resources'

export interface Flight {
  homeX: number
  homeZ: number
  radius: number
  speed: number
  height: number
  phase: number
}

const sides = [1, -1]

function createWingGeometry(
  scale: [number, number, number],
  offset: [number, number, number],
  segments: [number, number],
) {
  const geometry = new SphereGeometry(1, segments[0], segments[1])

  geometry.scale(...scale)
  geometry.translate(...offset)

  return geometry
}

function createBodyGeometry() {
  const geometry = new CapsuleGeometry(
    butterflyConfig.body.radius,
    butterflyConfig.body.length,
    3,
    6,
  )

  geometry.rotateX(Math.PI / 2)

  return geometry
}

export function Butterfly({
  flight,
  colors,
}: {
  flight: Flight
  colors: [string, string]
}) {
  const { getMatteMaterial } = useResources()

  const groupRef = useRef<Group>(null)
  const wingRefs = useRef<(Group | null)[]>([])
  const previous = useMemo(() => new Vector3(), [])

  const shapes = useMemo(
    () => ({
      fore: createWingGeometry(butterflyConfig.foreWing.scale, butterflyConfig.foreWing.offset, [7, 5]),
      hind: createWingGeometry(butterflyConfig.hindWing.scale, butterflyConfig.hindWing.offset, [6, 4]),
      body: createBodyGeometry(),
    }),
    [],
  )
  useFrame(({ clock }) => {
    const group = groupRef.current

    if (!group) {
      return
    }

    const elapsed = clock.elapsedTime
    const drift = elapsed * flight.speed + flight.phase
    const beat = elapsed * butterflyConfig.flapRate + flight.phase

    const x =
      flight.homeX + Math.sin(drift) * flight.radius + Math.sin(drift * 2.7 + 1.3) * flight.radius * 0.3
    const z =
      flight.homeZ + Math.cos(drift * 1.15) * flight.radius + Math.cos(drift * 3.1) * flight.radius * 0.28
    const y =
      flight.height + Math.sin(drift * 3.4) * butterflyConfig.bobHeight + Math.sin(beat) * 0.07

    previous.copy(group.position)
    group.position.set(x, y, z)

    const stepX = x - previous.x
    const stepZ = z - previous.z

    const hasTravelled = stepX * stepX + stepZ * stepZ > 1e-6

    if (hasTravelled) {
      group.rotation.y = Math.atan2(stepX, stepZ)
    }

    group.rotation.z = Math.sin(drift * 1.15) * butterflyConfig.leanAngle

    const flap = butterflyConfig.flapOpen + Math.sin(beat) * butterflyConfig.flapSwing

    wingRefs.current.forEach((wing, index) => {
      if (wing) {
        wing.rotation.z = flap * sides[index]
      }
    })
  })

  return (
    <group ref={groupRef}>
      {sides.map((side, index) => (
        <group
          key={side}
          ref={(wing) => {
            wingRefs.current[index] = wing
          }}
          scale-x={side}
        >
          <mesh geometry={shapes.fore} material={getMatteMaterial(colors[0])} />
          <mesh geometry={shapes.hind} material={getMatteMaterial(colors[1])} />
        </group>
      ))}

      <mesh geometry={shapes.body} material={getMatteMaterial(butterflyConfig.bodyColor)} />
    </group>
  )
}
