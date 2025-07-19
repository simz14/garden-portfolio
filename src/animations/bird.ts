import { gsap } from 'gsap'
import type { Group } from 'three'
import { birdConfig } from '../config/ambience'

interface Hop {
  to: number
  facing: number
  gapSeconds: number
  seconds: number
  arc: number
}

export interface BirdLoop {
  kill: () => void
}

export function createBirdHopping(bird: Group, chooseHop: () => Hop): BirdLoop {
  let waiting: gsap.core.Tween | null = null
  let hop: gsap.core.Timeline | null = null

  function step() {
    const next = chooseHop()

    bird.rotation.y = next.facing

    hop = gsap
      .timeline({
        onComplete() {
          waiting = gsap.delayedCall(next.gapSeconds, step)
        },
      })
      .to(bird.position, { x: next.to, duration: next.seconds, ease: 'none' }, 0)
      .to(
        bird.position,
        {
          y: birdConfig.railHeight + next.arc,
          duration: next.seconds / 2,
          ease: 'sine.out',
          yoyo: true,
          repeat: 1,
        },
        0,
      )
  }

  step()

  return {
    kill() {
      waiting?.kill()
      hop?.kill()
    },
  }
}

export function createBirdPecking(head: Group, chooseRest: () => number): BirdLoop {
  let waiting: gsap.core.Tween | null = null

  const peck = gsap.to(head.rotation, {
    x: birdConfig.peckAngle,
    duration: birdConfig.peckSeconds,
    ease: 'power2.in',
    yoyo: true,
    repeat: 1,
    paused: true,
    onComplete() {
      waiting = gsap.delayedCall(chooseRest(), () => peck.restart())
    },
  })

  waiting = gsap.delayedCall(chooseRest(), () => peck.restart())

  return {
    kill() {
      waiting?.kill()
      peck.kill()
    },
  }
}
