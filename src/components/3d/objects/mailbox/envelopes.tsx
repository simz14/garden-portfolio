import { useEffect, useMemo, useRef } from 'react'
import { Billboard } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import type { Group } from 'three'
import { contactLinks } from '../../../../data/contact'
import { mailFlightConfig } from '../../../../config/mailbox'
import { seedConfig } from '../../../../config/random'
import { createEnvelopeFlightTween } from '../../../../animations/mailbox'
import { useIsReducedMotion } from '../../../../hooks/device'
import { useGarden } from '../../../../hooks/garden'
import { createRandom } from '../../../../utils/random'
import { createEnvelopePaper, disposeEnvelopePaper } from '../../../../utils/envelope'
import { Envelope } from './envelope'

function createFlights() {
  const getRandom = createRandom(seedConfig.post)

  return mailFlightConfig.spots.map((spot, index) => {
    const angle = MathUtils.degToRad(spot.degrees)

    return {
      key: contactLinks[index].label,
      link: contactLinks[index],
      settled: new Vector3(
        Math.cos(angle) * mailFlightConfig.ringRadius,
        spot.height,
        Math.sin(angle) * mailFlightConfig.ringRadius,
      ),
      tilt: mailFlightConfig.tiltStart - index * mailFlightConfig.tiltStep,
      spin:
        (getRandom() < 0.5 ? -1 : 1) *
        (mailFlightConfig.minSpin + getRandom() * mailFlightConfig.spinSwing),
      delay: index * mailFlightConfig.delayStep,
      phase: getRandom() * Math.PI * 2,
    }
  })
}

export function Envelopes() {
  const isDelivered = useGarden((state) => state.isDelivered)
  const isReducedMotion = useIsReducedMotion()

  const flights = useMemo(createFlights, [])
  const paper = useMemo(createEnvelopePaper, [])
  const flightRefs = useRef<(Group | null)[]>([])
  const hasFlown = useRef(false)
  const rollRefs = useRef<(Group | null)[]>([])

  useEffect(() => {
    return function disposePaper() {
      disposeEnvelopePaper(paper)
    }
  }, [paper])

  useEffect(() => {
    const tweens = flights.map((item, index) => {
      const flight = flightRefs.current[index]

      if (!flight) {
        return null
      }

      return createEnvelopeFlightTween(
        flight,
        item.settled,
        item.delay,
        isDelivered,
        !hasFlown.current && !isDelivered,
      )
    })

    hasFlown.current = true

    return function killTweens() {
      for (const tween of tweens) {
        tween?.kill()
      }
    }
  }, [isDelivered, flights])

  useFrame(({ clock }) => {
    if (!isDelivered) {
      return
    }

    const elapsed = clock.elapsedTime

    flights.forEach((item, index) => {
      const flight = flightRefs.current[index]
      const roll = rollRefs.current[index]

      const hasParts = flight !== null && roll !== null

      if (!hasParts) {
        return
      }

      const sway = isReducedMotion
        ? 0
        : Math.sin(elapsed * mailFlightConfig.swaySpeed + item.phase) * mailFlightConfig.swayAngle

      roll.rotation.z = item.tilt + sway
      flight.position.y =
        item.settled.y +
        (isReducedMotion
          ? 0
          : Math.sin(elapsed * mailFlightConfig.bobSpeed + item.phase) *
            mailFlightConfig.bobHeight)
    })
  })

  return (
    <>
      {flights.map((item, index) => (
        <group
          key={item.key}
          ref={(group) => {
            flightRefs.current[index] = group
          }}
          visible={false}
        >
          <Billboard>
            <group
              ref={(group) => {
                rollRefs.current[index] = group
              }}
              rotation-z={item.tilt}
            >
              <Envelope paper={paper} link={item.link} />
            </group>
          </Billboard>
        </group>
      ))}
    </>
  )
}
