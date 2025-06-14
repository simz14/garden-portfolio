import { useRef } from 'react'
import type { Group } from 'three'
import { gardenerConfig } from '../../../config/gardener'
import { useGardenerActions } from '../../../hooks/gardener'
import { Body } from './gardener/body'
import type { GardenerParts } from './gardener/body'

export function Gardener() {
  const groupRef = useRef<Group>(null)
  const partsRef = useRef<GardenerParts>(null)

  useGardenerActions(groupRef)

  return (
    <group
      ref={groupRef}
      position={gardenerConfig.home}
      rotation-y={gardenerConfig.facing}
      scale={gardenerConfig.scale}
    >
      <Body ref={partsRef} />
    </group>
  )
}
