import { useRef } from 'react'
import type { Group } from 'three'
import { gardenerConfig } from '../../../config/gardener'
import { useGardenerActions } from '../../../hooks/gardener'
import { GardenerTalk } from '../labels/gardener-talk'
import { GardenerTumble } from '../labels/gardener-tumble'
import { Body } from './gardener/body'
import type { GardenerParts } from './gardener/body'

export function Gardener() {
  const groupRef = useRef<Group>(null)
  const bodyRef = useRef<Group>(null)
  const partsRef = useRef<GardenerParts>(null)

  useGardenerActions(groupRef, bodyRef, partsRef)

  return (
    <group
      ref={groupRef}
      position={gardenerConfig.home}
      rotation-y={gardenerConfig.facing}
      scale={gardenerConfig.scale}
    >
      {/* The root group is owned by physics and steering, so the walk bounce and
          the body lean live one level in, where they cannot fight the fall. */}
      <group ref={bodyRef}>
        <Body ref={partsRef} />
      </group>

      <group scale={1 / gardenerConfig.scale}>
        <GardenerTalk />
        <GardenerTumble />
      </group>
    </group>
  )
}
