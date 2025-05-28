import { useSyncExternalStore } from 'react'

const coarsePointerQuery = '(pointer: coarse)'
const portraitQuery = '(max-aspect-ratio: 1/1)'
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const compactQuery = '(max-width: 639px)'

function getIsMatching(query: string) {
  return window.matchMedia(query).matches
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)

      media.addEventListener('change', onChange)

      return function stopWatching() {
        media.removeEventListener('change', onChange)
      }
    },
    () => getIsMatching(query),
  )
}

export function useIsTouch() {
  return useMediaQuery(coarsePointerQuery)
}

export function useIsPortrait() {
  return useMediaQuery(portraitQuery)
}

export function useIsCompact() {
  return useMediaQuery(compactQuery)
}

export function useIsReducedMotion() {
  return useMediaQuery(reducedMotionQuery)
}
