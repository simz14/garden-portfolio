import { useEffect, useRef } from 'react'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import type { Group } from 'three'
import { obstacleConfig } from '../../../config/garden'
import { wateringCanConfig } from '../../../config/watering-can'
import { useWateringRegistry } from '../../../hooks/watering'
import { Can } from './watering-can/can'
import { Droplets } from './watering-can/droplets'
import type { DropletsHandle } from './watering-can/droplets'

const halfWall = obstacleConfig.wallHeight / 2

export function WateringCan() {
  const { registerWateringCan } = useWateringRegistry()

  const canRef = useRef<Group>(null)
  const dropletsRef = useRef<DropletsHandle>(null)

  useEffect(() => {
    const group = canRef.current
    const droplets = dropletsRef.current

    const hasParts = group !== null && droplets !== null

    if (!hasParts) {
      return
    }

    return registerWateringCan({ group, pour: droplets.pour, clear: droplets.clear })
  }, [registerWateringCan])

  return (
    <>
      <Can ref={canRef} />
      <Droplets ref={dropletsRef} />

      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider
          args={[halfWall, wateringCanConfig.postRadius]}
          position={[wateringCanConfig.rest[0], halfWall, wateringCanConfig.rest[2]]}
        />
      </RigidBody>
    </>
  )
}
