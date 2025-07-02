import { useEffect, useMemo, useRef } from 'react'
import { Instance, Instances } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import type { Group } from 'three'
import { bedConfig } from '../../../../config/beds'
import { paletteConfig } from '../../../../config/garden'
import { seedConfig } from '../../../../config/random'
import { useResources } from '../../../../context/resources'
import { useWateringRegistry } from '../../../../hooks/watering'
import { createFlower } from '../../../../utils/flowers'
import { getWorldOffset } from '../../../../utils/garden'
import { createRandom } from '../../../../utils/random'

type BedProfile = (typeof bedConfig.beds)[number]

function createLeaves(getRandom: () => number) {
  const span = bedConfig.size - bedConfig.leafMargin * 2

  return Array.from({ length: bedConfig.leafCount }, (_, index) => {
    const radius = bedConfig.leafMinRadius + getRandom() * bedConfig.leafRadiusSwing

    return {
      key: index,
      position: [
        bedConfig.leafMargin + getRandom() * span,
        bedConfig.soilTop + radius * 0.4,
        bedConfig.leafMargin + getRandom() * span,
      ] as [number, number, number],
      rotation: [
        getRandom() * Math.PI,
        getRandom() * Math.PI,
        getRandom() * Math.PI,
      ] as [number, number, number],
      scale: [radius, radius * 0.6, radius] as [number, number, number],
    }
  })
}

function createFlowers(getRandom: () => number) {
  const spacing = (bedConfig.size - bedConfig.flowerMargin * 2) / (bedConfig.flowersPerRow - 1)

  return Array.from({ length: bedConfig.flowerCount }, (_, index) => {
    const size = bedConfig.flowerMinScale + getRandom() * bedConfig.flowerScaleSwing
    const column = index % bedConfig.flowersPerRow
    const row = Math.floor(index / bedConfig.flowersPerRow)

    return {
      key: index,
      position: [
        bedConfig.flowerMargin + column * spacing + (getRandom() - 0.5) * bedConfig.flowerJitter,
        0,
        bedConfig.flowerMargin + row * spacing + (getRandom() - 0.5) * bedConfig.flowerJitter,
      ] as [number, number, number],
      rotation: [0, getRandom() * Math.PI * 2, (getRandom() - 0.5) * 0.16] as [
        number,
        number,
        number,
      ],
      scale: [size, size, size] as [number, number, number],
    }
  })
}

export function Bed({ bed, index }: { bed: BedProfile, index: number }) {
  const { box, leaf, flowerMaterial, getMatteMaterial } = useResources()
  const { getBedProgress } = useWateringRegistry()

  const flowersRef = useRef<Group>(null)

  const getRandom = useMemo(
    () => createRandom(seedConfig.beds + index * bedConfig.seedStride),
    [index],
  )
  const leaves = useMemo(() => createLeaves(getRandom), [getRandom])
  const flowers = useMemo(() => createFlowers(getRandom), [getRandom])

  const flowerGeometry = useMemo(
    () => createFlower(bed.kind, { petal: bed.petal, heart: bed.heart, stem: bed.leaf }),
    [bed],
  )

  useEffect(() => {
    return function disposeFlower() {
      flowerGeometry.dispose()
    }
  }, [flowerGeometry])

  useFrame((_, delta) => {
    const group = flowersRef.current

    if (!group) {
      return
    }

    const settled = MathUtils.clamp(getBedProgress(index), 0, 1)
    const target = bedConfig.soilTop + settled * bedConfig.flowerLift

    group.position.y = MathUtils.damp(
      group.position.y,
      target,
      bedConfig.flowerSettleRate,
      delta,
    )
  })

  return (
    <group position={[getWorldOffset(bed.x), 0, getWorldOffset(bed.y)]}>
      <mesh
        geometry={box}
        material={getMatteMaterial(paletteConfig.timber)}
        position={[bedConfig.size / 2, bedConfig.frameHeight / 2, bedConfig.size / 2]}
        scale={[bedConfig.size, bedConfig.frameHeight, bedConfig.size]}
        castShadow
        receiveShadow
      />

      <mesh
        geometry={box}
        material={getMatteMaterial(paletteConfig.soil)}
        position={[
          bedConfig.size / 2,
          bedConfig.soilTop - bedConfig.soilThickness / 2,
          bedConfig.size / 2,
        ]}
        scale={[
          bedConfig.size - bedConfig.frameInset * 2,
          bedConfig.soilThickness,
          bedConfig.size - bedConfig.frameInset * 2,
        ]}
        receiveShadow
      />

      <Instances
        frustumCulled={false}
        geometry={leaf}
        material={getMatteMaterial(bed.leaf)}
        limit={leaves.length}
        range={leaves.length}
        castShadow
        receiveShadow
      >
        {leaves.map((entry) => (
          <Instance
            key={entry.key}
            position={entry.position}
            rotation={entry.rotation}
            scale={entry.scale}
          />
        ))}
      </Instances>

      <group ref={flowersRef} position-y={bedConfig.soilTop}>
        <Instances
          frustumCulled={false}
          geometry={flowerGeometry}
          material={flowerMaterial}
          limit={flowers.length}
          range={flowers.length}
          castShadow
        >
          {flowers.map((entry) => (
            <Instance
              key={entry.key}
              position={entry.position}
              rotation={entry.rotation}
              scale={entry.scale}
            />
          ))}
        </Instances>
      </group>

      <mesh
        geometry={box}
        material={getMatteMaterial(bedConfig.sign.postColor)}
        position={[
          bedConfig.size - 0.55,
          bedConfig.frameHeight + bedConfig.sign.postSize[1] / 2,
          bedConfig.size - 0.14,
        ]}
        scale={bedConfig.sign.postSize}
        castShadow
      />

      <mesh
        geometry={box}
        material={getMatteMaterial(bedConfig.sign.boardColor)}
        position={[
          bedConfig.size - 0.52,
          bedConfig.frameHeight + bedConfig.sign.postSize[1] - 0.02,
          bedConfig.size - 0.145,
        ]}
        scale={bedConfig.sign.boardSize}
        castShadow
      />
    </group>
  )
}
