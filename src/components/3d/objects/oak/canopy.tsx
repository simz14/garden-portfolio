import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { paletteConfig } from '../../../../config/garden'
import { oakCanopyConfig, oakConfig } from '../../../../config/oak'
import { useIsReducedMotion } from '../../../../hooks/device'
import { useResources } from '../../../../context/resources'

export function Canopy() {
  const { getMatteMaterial, canopies } = useResources()
  const isReducedMotion = useIsReducedMotion()
  const blobRefs = useRef<(Mesh | null)[]>([])

  useFrame(({ clock }) => {
    if (isReducedMotion) {
      return
    }

    const elapsed = clock.elapsedTime

    blobRefs.current.forEach((blob, index) => {
      if (!blob) {
        return
      }

      const phase = index * oakCanopyConfig.phaseStep

      blob.rotation.z =
        Math.sin(elapsed * oakCanopyConfig.swaySpeed + phase) * oakCanopyConfig.swayAngle
      blob.position.y =
        oakCanopyConfig.blobs[index].at[1] +
        Math.sin(elapsed * oakCanopyConfig.bobSpeed + phase) * oakCanopyConfig.bobHeight
    })
  })

  return (
    <group position-y={oakConfig.trunkHeight}>
      {oakCanopyConfig.blobs.map((blob, index) => (
        <mesh
          key={`${blob.at.join(',')}-${blob.radius}`}
          ref={(mesh) => {
            blobRefs.current[index] = mesh
          }}
          geometry={canopies[blob.shape]}
          material={getMatteMaterial(paletteConfig.canopy[blob.color])}
          position={blob.at}
          scale={[blob.radius, blob.radius * blob.squash, blob.radius]}
          rotation={[
            Math.sin(index * 1.7) * 0.11,
            index * 2.39,
            Math.cos(index * 2.1) * 0.11,
          ]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  )
}
