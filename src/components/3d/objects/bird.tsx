import { useEffect, useMemo, useRef } from 'react'
import { MathUtils } from 'three'
import type { Group } from 'three'
import { createBirdHopping, createBirdPecking } from '../../../animations/bird'
import { birdConfig } from '../../../config/ambience'
import { seedConfig } from '../../../config/random'
import { useIsReducedMotion } from '../../../hooks/device'
import { useResources } from '../../../context/resources'
import { getPostOffsets } from '../../../utils/fence'
import { createRandom } from '../../../utils/random'

export function Bird() {
  const { box, getMatteMaterial } = useResources()
  const isReducedMotion = useIsReducedMotion()

  const birdRef = useRef<Group>(null)
  const headRef = useRef<Group>(null)

  const getRandom = useMemo(() => createRandom(seedConfig.decor), [])

  const perches = useMemo(
    () => getPostOffsets().filter((offset) => Math.abs(offset) <= birdConfig.reach),
    [],
  )

  const startPerch = useMemo(() => {
    let nearest = 0

    perches.forEach((offset, index) => {
      const isCloser =
        Math.abs(offset - birdConfig.startX) < Math.abs(perches[nearest] - birdConfig.startX)

      if (isCloser) {
        nearest = index
      }
    })

    return nearest
  }, [perches])

  useEffect(() => {
    const bird = birdRef.current
    const head = headRef.current

    if (!bird || !head || isReducedMotion) {
      return
    }

    let perch = startPerch

    function chooseHop() {
      const skip =
        birdConfig.minHopPosts + Math.floor(getRandom() * birdConfig.hopPostSwing)
      const heading = getRandom() > 0.5 ? 1 : -1
      const wanted = perch + heading * skip

      const landed = MathUtils.clamp(
        wanted < 0 || wanted > perches.length - 1 ? perch - heading * skip : wanted,
        0,
        perches.length - 1,
      )
      const posts = Math.abs(landed - perch)

      const direction = landed > perch ? 1 : -1

      perch = landed

      const isResting = getRandom() < birdConfig.restChance
      const restSeconds = isResting
        ? birdConfig.restSeconds + getRandom() * birdConfig.restSwing
        : 0

      return {
        to: perches[perch],
        facing: direction * (Math.PI / 2),
        gapSeconds:
          birdConfig.hopGapSeconds + getRandom() * birdConfig.hopGapSwing + restSeconds,
        seconds: birdConfig.hopSeconds + (posts - 1) * birdConfig.hopSecondsPerPost,
        arc: birdConfig.hopArc + (posts - 1) * birdConfig.hopArcPerPost,
      }
    }

    let pecksLeft = 0

    function choosePeckRest() {
      if (pecksLeft > 0) {
        pecksLeft -= 1

        return birdConfig.peckRestSeconds
      }

      pecksLeft = birdConfig.minPeckBurst + Math.floor(getRandom() * birdConfig.peckBurstSwing)

      return birdConfig.peckStillSeconds + getRandom() * birdConfig.peckStillSwing
    }

    const hop = createBirdHopping(bird, chooseHop)
    const peck = createBirdPecking(head, choosePeckRest)

    return function killLoops() {
      hop.kill()
      peck.kill()
    }
  }, [isReducedMotion, getRandom, perches, startPerch])

  return (
    <group
      ref={birdRef}
      position={[perches[startPerch], birdConfig.railHeight, birdConfig.railDepth]}
      rotation-y={Math.PI / 2}
    >
      <mesh
        material={getMatteMaterial(birdConfig.bodyColor)}
        position-y={0.13}
        scale={[0.11, 0.1, 0.14]}
        castShadow
      >
        <sphereGeometry args={[1, 9, 7]} />
      </mesh>

      <mesh
        material={getMatteMaterial(birdConfig.breastColor)}
        position={[0, 0.12, 0.07]}
        scale={[0.08, 0.075, 0.07]}
      >
        <sphereGeometry args={[1, 8, 6]} />
      </mesh>

      <group ref={headRef} position={[0, 0.21, 0.07]}>
        <mesh material={getMatteMaterial(birdConfig.bodyColor)} castShadow>
          <sphereGeometry args={[0.075, 8, 6]} />
        </mesh>

        <mesh
          material={getMatteMaterial(birdConfig.beakColor)}
          position-z={0.08}
          rotation-x={Math.PI / 2}
        >
          <coneGeometry args={[0.022, 0.075, 5]} />
        </mesh>
      </group>

      <mesh
        geometry={box}
        material={getMatteMaterial(birdConfig.tailColor)}
        position={[0, 0.15, -0.15]}
        scale={[0.07, 0.02, 0.13]}
        rotation-x={-0.35}
      />
    </group>
  )
}
