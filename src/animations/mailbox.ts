import { gsap } from 'gsap'
import { Vector3 } from 'three'
import type { Group, Object3D } from 'three'
import { mailFlightConfig, mailboxConfig } from '../config/mailbox'

export function createMailboxDoorTween(door: Object3D, isOpen: boolean) {
  return gsap.to(door.rotation, {
    z: isOpen ? -mailboxConfig.doorOpenAngle : 0,
    duration: mailboxConfig.doorSeconds,
    ease: 'power2.inOut',
  })
}

export function createDeliveryDelay(onDelivered: () => void) {
  return gsap.delayedCall(mailboxConfig.doorSeconds, onDelivered)
}

export function createLetterSlideTween(letter: Object3D, isOut: boolean) {
  return gsap.to(letter.position, {
    x: mailboxConfig.letter.position[0] + (isOut ? mailboxConfig.letter.travel : 0),
    duration: mailboxConfig.letter.seconds,
    ease: 'power2.out',
  })
}

const mouth = new Vector3(...mailFlightConfig.mouth)

export function createEnvelopeFlightTween(
  envelope: Group,
  settled: Vector3,
  delay: number,
  isDelivered: boolean,
  isInstant: boolean,
) {
  const flight = { progress: isDelivered ? 0 : 1 }

  return gsap.to(flight, {
    progress: isDelivered ? 1 : 0,
    duration: isInstant ? 0 : mailFlightConfig.flightSeconds,
    delay: isDelivered && !isInstant ? delay : 0,
    ease: 'power2.out',
    onUpdate() {
      envelope.position.lerpVectors(mouth, settled, flight.progress)
      envelope.position.y += Math.sin(flight.progress * Math.PI) * mailFlightConfig.arcHeight
      envelope.visible = flight.progress > 0
    },
  })
}
