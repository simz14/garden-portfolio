import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'
import { CylinderGeometry } from 'three'
import { mailboxGrassConfig } from '../../../../config/mailbox'
import { seedConfig } from '../../../../config/random'
import { useResources } from '../../../../context/resources'
import { createClump } from '../../../../utils/geometry'
import { createRandom } from '../../../../utils/random'

function createBladeGeometry() {
  const geometry = new CylinderGeometry(
    mailboxGrassConfig.blade.radiusTop,
    mailboxGrassConfig.blade.radiusBottom,
    1,
    mailboxGrassConfig.blade.segments,
  )

  geometry.translate(0, 0.5, 0)

  return geometry
}

// sqrt of a uniform draw spreads blades evenly instead of bunching at the centre
function createBlades() {
  const getRandom = createRandom(seedConfig.decor)

  return Array.from({ length: mailboxGrassConfig.bladeCount }, (_, index) => {
    const angle = getRandom() * Math.PI * 2
    const distance =
      mailboxGrassConfig.minDistance + Math.sqrt(getRandom()) * mailboxGrassConfig.distanceSwing
    const height =
      mailboxGrassConfig.baseHeight -
      (distance - mailboxGrassConfig.minDistance) * mailboxGrassConfig.heightFalloff +
      getRandom() * mailboxGrassConfig.heightSwing

    return {
      key: index,
      position: [Math.cos(angle) * distance, 0, Math.sin(angle) * distance] as [
        number,
        number,
        number,
      ],
      rotation: [
        Math.sin(angle) * mailboxGrassConfig.leanStrength * (0.5 + getRandom()),
        getRandom() * Math.PI * 2,
        -Math.cos(angle) * mailboxGrassConfig.leanStrength * (0.5 + getRandom()),
      ] as [number, number, number],
      scale: [1, height, 1] as [number, number, number],
    }
  })
}

function createSkirt() {
  return mailboxGrassConfig.skirtOffsets.map(([x, z], index) => ({
    key: index,
    ...createClump(
      createRandom(seedConfig.decor + mailboxGrassConfig.skirtSeedOffset + index),
      [x, mailboxGrassConfig.skirtHeight, z],
      mailboxGrassConfig.skirtRadius,
    ),
  }))
}

export function Grass() {
  const { leaf, bladeMaterial, getMatteMaterial } = useResources()

  const geometry = useMemo(createBladeGeometry, [])
  const blades = useMemo(createBlades, [])
  const skirt = useMemo(createSkirt, [])

  return (
    <>
      <Instances
        frustumCulled={false}
        geometry={geometry}
        material={bladeMaterial}
        limit={blades.length}
        range={blades.length}
      >
        {blades.map((blade) => (
          <Instance
            key={blade.key}
            position={blade.position}
            rotation={blade.rotation}
            scale={blade.scale}
          />
        ))}
      </Instances>

      {skirt.map((clump) => (
        <mesh
          key={clump.key}
          geometry={leaf}
          material={getMatteMaterial(mailboxGrassConfig.skirtColor)}
          position={clump.position}
          rotation={clump.rotation}
          scale={clump.scale}
          castShadow
          receiveShadow
        />
      ))}
    </>
  )
}
