import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export function useIsSectionActive(sectionRef: RefObject<HTMLElement | null>) {
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) {
      return
    }

    let isInView = true

    function applyActiveState() {
      setIsActive(isInView && document.visibilityState === 'visible')
    }

    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry.isIntersecting
      applyActiveState()
    })

    observer.observe(section)
    document.addEventListener('visibilitychange', applyActiveState)

    return function stopWatching() {
      observer.disconnect()
      document.removeEventListener('visibilitychange', applyActiveState)
    }
  }, [sectionRef])

  return isActive
}
