import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'
import { oakLeafConfig } from '../../../../config/oak'
import { useResources } from '../../../../context/resources'

function createBlades() {
  const blades = []

  for (let cluster = 0; cluster < oakLeafConfig.clusterCount; cluster += 1) {
    const angle =
      (cluster / oakLeafConfig.clusterCount) * Math.PI * 2 +
      Math.sin(cluster * 2.7) * oakLeafConfig.angleJitter
    const distance =
      oakLeafConfig.baseDistance + Math.sin(cluster * 1.9) * oakLeafConfig.distanceSwing
    const centreX = Math.cos(angle) * distance
    const centreZ = Math.sin(angle) * distance

    for (let blade = 0; blade < oakLeafConfig.bladesPerCluster; blade += 1) {
      const spread = angle + blade * oakLeafConfig.bladeStep
      const size =
        oakLeafConfig.baseSize + Math.sin(cluster * 3.3 + blade) * oakLeafConfig.sizeSwing

      blades.push({
        key: `${cluster}-${blade}`,
        color: oakLeafConfig.colors[blade % oakLeafConfig.colors.length],
        position: [
          centreX + Math.cos(spread) * oakLeafConfig.bladeSpread,
          oakLeafConfig.height,
          centreZ + Math.sin(spread) * oakLeafConfig.bladeSpread,
        ] as [number, number, number],
        rotation: [0, -spread, oakLeafConfig.tilt] as [number, number, number],
        scale: [size, size * 0.38, size * 0.72] as [number, number, number],
      })
    }
  }

  return blades
}

export function Leaves() {
  const { leaf } = useResources()
  const blades = useMemo(createBlades, [])

  return (
    <Instances
      geometry={leaf}
      limit={blades.length}
      range={blades.length}
      castShadow
      receiveShadow
    >
      <meshLambertNodeMaterial />

      {blades.map((blade) => (
        <Instance
          key={blade.key}
          color={blade.color}
          position={blade.position}
          rotation={blade.rotation}
          scale={blade.scale}
        />
      ))}
    </Instances>
  )
}
