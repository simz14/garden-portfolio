import { gsap } from 'gsap'
import { introOverlayConfig } from '../config/intro'

function getItems(root: HTMLElement) {
  return root.querySelectorAll<HTMLElement>(introOverlayConfig.itemSelector)
}

export function createIntroRevealTimeline(root: HTMLElement, isReducedMotion: boolean) {
  return gsap.timeline().from(getItems(root), {
    y: isReducedMotion ? 0 : introOverlayConfig.enterOffset,
    autoAlpha: 0,
    duration: isReducedMotion ? introOverlayConfig.reducedSeconds : introOverlayConfig.enterSeconds,
    stagger: isReducedMotion ? 0 : introOverlayConfig.enterStagger,
    ease: introOverlayConfig.enterEase,
  })
}

export function createIntroDismissTimeline(root: HTMLElement, isReducedMotion: boolean) {
  const timeline = gsap.timeline()

  timeline
    .to(getItems(root), {
      y: isReducedMotion ? 0 : introOverlayConfig.exitOffset,
      autoAlpha: 0,
      duration: isReducedMotion
        ? introOverlayConfig.reducedSeconds
        : introOverlayConfig.exitSeconds,
      stagger: isReducedMotion ? 0 : introOverlayConfig.exitStagger,
      ease: introOverlayConfig.exitEase,
    })
    .to(
      root,
      {
        autoAlpha: 0,
        duration: isReducedMotion
          ? introOverlayConfig.reducedSeconds
          : introOverlayConfig.fadeSeconds,
        ease: introOverlayConfig.fadeEase,
      },
      '<',
    )

  return timeline
}
