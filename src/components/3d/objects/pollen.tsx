import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Matrix4, Quaternion, Vector3 } from 'three'
import type { InstancedMesh } from 'three'
import { pollenConfig } from '../../../config/ambience'
import { seedConfig } from '../../../config/random'
import { useIsReducedMotion } from '../../../hooks/device'
import { QualityLevel, useQualityLevel } from '../../../hooks/quality'
import { createRandom } from '../../../utils/random'

interface Mote {
  home: Vector3
  phase: Vector3
  wander: Vector3
  speed: number
  radius: number
}

function createMotes(count: number): Mote[] {
  const getRandom = createRandom(seedConfig.pollen)
  const [spreadX, spreadY, spreadZ] = pollenConfig.spread

  return Array.from({ length: count }, () => ({
    home: new Vector3(
      (getRandom() - 0.5) * spreadX,
      (getRandom() - 0.5) * spreadY,
      (getRandom() - 0.5) * spreadZ,
    ),
    phase: new Vector3(
      getRandom() * Math.PI * 2,
      getRandom() * Math.PI * 2,
      getRandom() * Math.PI * 2,
    ),
    wander: new Vector3(
      pollenConfig.minWander + getRandom() * pollenConfig.wanderSwing,
      pollenConfig.minWander + getRandom() * pollenConfig.wanderSwing,
      pollenConfig.minWander + getRandom() * pollenConfig.wanderSwing,
    ),
    speed: pollenConfig.minSpeed + getRandom() * pollenConfig.speedSwing,
    radius: pollenConfig.minRadius + getRandom() * pollenConfig.radiusSwing,
  }))
}

export function Pollen() {
  const isReducedMotion = useIsReducedMotion()
  const qualityLevel = useQualityLevel()

  const meshRef = useRef<InstancedMesh>(null)

  const count =
    qualityLevel === QualityLevel.High ? pollenConfig.highCount : pollenConfig.lowCount

  const motes = useMemo(() => createMotes(count), [count])

  const scratch = useMemo(
    () => ({
      matrix: new Matrix4(),
      position: new Vector3(),
      scale: new Vector3(),
      spin: new Quaternion(),
    }),
    [],
  )

  useFrame(({ clock }) => {
    const mesh = meshRef.current

    if (!mesh) {
      return
    }

    const elapsed = clock.elapsedTime

    motes.forEach((mote, index) => {
      const drift = elapsed * mote.speed

      scratch.position.set(
        mote.home.x + (Math.sin(drift + mote.phase.x) + Math.sin(drift * 0.47 + mote.phase.z) * 0.6) * mote.wander.x,
        mote.home.y + (Math.sin(drift * 0.73 + mote.phase.y) + Math.cos(drift * 0.31 + mote.phase.x) * 0.5) * mote.wander.y,
        mote.home.z + (Math.cos(drift * 0.61 + mote.phase.z) + Math.sin(drift * 0.83 + mote.phase.y) * 0.7) * mote.wander.z,
      )

      scratch.matrix.compose(
        scratch.position,
        scratch.spin,
        scratch.scale.setScalar(mote.radius),
      )
      mesh.setMatrixAt(index, scratch.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  if (isReducedMotion) {
    return null
  }

  return (
    <instancedMesh
      key={count}
      ref={meshRef}
      args={[undefined, undefined, count]}
      position-y={pollenConfig.centreHeight}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 6, 4]} />
      <meshBasicNodeMaterial
        color={pollenConfig.color}
        transparent
        opacity={pollenConfig.opacity}
        depthWrite={false}
      />
    </instancedMesh>
  )
}
