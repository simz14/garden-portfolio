import { useImperativeHandle, useMemo, useRef } from 'react'
import type { Ref } from 'react'
import { Matrix4, Quaternion, Vector3 } from 'three'
import type { InstancedMesh, Vector3 as Vector3Type } from 'three'
import { bedConfig } from '../../../../config/beds'
import { seedConfig } from '../../../../config/random'
import { dropletConfig } from '../../../../config/watering-can'
import { createRandom } from '../../../../utils/random'

export interface DropletsHandle {
  pour: (delta: number, from: Vector3Type, direction: Vector3Type, isPouring: boolean) => void
  clear: () => void
}

function createDrops() {
  return Array.from({ length: dropletConfig.count }, () => ({
    life: 0,
    position: new Vector3(),
    velocity: new Vector3(),
  }))
}

export function Droplets({ ref }: { ref: Ref<DropletsHandle> }) {
  const meshRef = useRef<InstancedMesh>(null)

  const state = useMemo(
    () => ({
      drops: createDrops(),
      getRandom: createRandom(seedConfig.decor),
      matrix: new Matrix4(),
      scale: new Vector3(),
      spin: new Quaternion(),
      cursor: 0,
      countdown: 0,
    }),
    [],
  )

  useImperativeHandle(
    ref,
    () => ({
      pour(delta, from, direction, isPouring) {
        const mesh = meshRef.current

        if (!mesh) {
          return
        }

        const { drops, getRandom } = state

        if (isPouring) {
          state.countdown -= delta

          while (state.countdown <= 0) {
            state.countdown += dropletConfig.spawnInterval

            const drop = drops[state.cursor]

            state.cursor = (state.cursor + 1) % dropletConfig.count
            drop.life = dropletConfig.lifeSeconds
            drop.position.set(
              from.x + (getRandom() - 0.5) * dropletConfig.spread,
              from.y,
              from.z + (getRandom() - 0.5) * dropletConfig.spread,
            )
            const throwSpeed =
              dropletConfig.minForward + getRandom() * dropletConfig.forwardSwing

            drop.velocity.set(
              direction.x * throwSpeed,
              -dropletConfig.minFall - getRandom() * dropletConfig.fallSwing,
              direction.z * throwSpeed,
            )
          }
        }

        let aliveCount = 0

        drops.forEach((drop, index) => {
          if (drop.life > 0) {
            drop.life -= delta
            drop.velocity.y -= dropletConfig.gravity * delta
            drop.position.addScaledVector(drop.velocity, delta)

            if (drop.position.y < bedConfig.soilTop) {
              drop.life = 0
            }
          }

          const size =
            drop.life > 0
              ? dropletConfig.minSize + drop.life * dropletConfig.sizeFromLife
              : 0

          if (size) {
            aliveCount += 1
          }

          state.matrix.compose(
            drop.position,
            state.spin,
            state.scale.set(size, size * dropletConfig.stretch, size),
          )
          mesh.setMatrixAt(index, state.matrix)
        })

        mesh.instanceMatrix.needsUpdate = true
        mesh.visible = aliveCount > 0
      },

      clear() {
        const mesh = meshRef.current

        if (!mesh) {
          return
        }

        state.drops.forEach((drop) => {
          drop.life = 0
        })
        state.countdown = 0
        mesh.visible = false
      },
    }),
    [state],
  )

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, dropletConfig.count]}
      frustumCulled={false}
      visible={false}
    >
      <sphereGeometry args={[1, 6, 5]} />
      <meshLambertNodeMaterial
        color={dropletConfig.color}
        transparent
        opacity={dropletConfig.opacity}
      />
    </instancedMesh>
  )
}
