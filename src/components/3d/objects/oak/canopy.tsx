import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh, PointLight } from 'three'
import { paletteConfig } from '../../../../config/garden'
import { oakCanopyConfig, oakConfig, oakLightConfig } from '../../../../config/oak'
import { createCanopyRevealTween } from '../../../../animations/oak'
import { useIsReducedMotion } from '../../../../hooks/device'
import { useGarden } from '../../../../hooks/garden'
import { useResources } from '../../../../context/resources'
import { HotspotId } from '../../../../config/hotspots'

export function Canopy() {
  const { getMatteMaterial, canopies } = useResources()
  const isReducedMotion = useIsReducedMotion()
  const isRevealed = useGarden((state) => state.selected === HotspotId.About)

  const groupRef = useRef<Group>(null)
  const lightRef = useRef<PointLight>(null)
  const blobRefs = useRef<(Mesh | null)[]>([])

  useEffect(() => {
    const group = groupRef.current
    const light = lightRef.current

    const hasParts = group !== null && light !== null

    if (!hasParts) {
      return
    }

    const tween = createCanopyRevealTween(group, light, isRevealed)

    return function killTween() {
      tween.kill()
    }
  }, [isRevealed])

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
    <>
      <group ref={groupRef} position-y={oakConfig.trunkHeight}>
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

      <pointLight
        ref={lightRef}
        color={oakLightConfig.color}
        intensity={0}
        distance={oakLightConfig.distance}
        decay={oakLightConfig.decay}
        position={[
          oakLightConfig.offset[0],
          oakConfig.trunkHeight + oakLightConfig.offset[1],
          oakLightConfig.offset[2],
        ]}
      />
    </>
  )
}
