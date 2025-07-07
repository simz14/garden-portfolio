import { useRef } from 'react'
import type { Group } from 'three'
import { wateringCanConfig } from '../../../config/watering-can'
import { Can } from './watering-can/can'

export function WateringCan() {
  const canRef = useRef<Group>(null)

  return (
    <group
      ref={canRef}
      position={wateringCanConfig.rest}
      rotation-y={wateringCanConfig.restYaw}
      scale={wateringCanConfig.scale}
    >
      <Can />
    </group>
  )
}
