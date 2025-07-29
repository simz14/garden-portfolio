import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { thumbstickConfig } from '../../config/controls'
import { setGarden } from '../../hooks/garden'
import { useThumbstick } from '../../hooks/movement'
import { cn } from '../../utils/cn'

export function Thumbstick({ isHidden }: { isHidden: boolean }) {
  const { setThumbstick } = useThumbstick()

  const padRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLSpanElement>(null)
  const pointerId = useRef<number | null>(null)
  const [isHeld, setIsHeld] = useState(false)
  const release = useCallback(() => {
    pointerId.current = null
    setThumbstick(0, 0)

    if (knobRef.current) {
      knobRef.current.style.transform = ''
    }
  }, [setThumbstick])

  useEffect(() => release, [release])
  useEffect(() => {
    if (isHidden) {
      release()
    }
  }, [isHidden, release])

  function lean(x: number, y: number) {
    const distance = Math.hypot(x, y)
    const clamp = distance > 1 ? 1 / distance : 1
    const leanX = x * clamp
    const leanY = y * clamp

    if (Math.hypot(leanX, leanY) < thumbstickConfig.deadzone) {
      setThumbstick(0, 0)
    } else {
      setThumbstick(leanX, -leanY)
      setGarden({ isGreeting: false })
    }

    if (knobRef.current) {
      const travel = thumbstickConfig.knobTravel

      knobRef.current.style.transform = `translate(${leanX * travel}px, ${leanY * travel}px)`
    }
  }

  function track(event: ReactPointerEvent<HTMLDivElement>) {
    const pad = padRef.current

    if (!pad) {
      return
    }

    const box = pad.getBoundingClientRect()

    lean(
      (event.clientX - (box.left + box.width / 2)) / (box.width / 2),
      (event.clientY - (box.top + box.height / 2)) / (box.height / 2),
    )
  }

  function handleRelease() {
    release()
    setIsHeld(false)
  }

  return (
    <div
      ref={padRef}
      aria-hidden
      onPointerDown={(event) => {
        if (pointerId.current !== null) {
          return
        }

        pointerId.current = event.pointerId
        event.currentTarget.setPointerCapture(event.pointerId)
        setIsHeld(true)
        track(event)
      }}
      onPointerMove={(event) => {
        if (pointerId.current === event.pointerId) {
          track(event)
        }
      }}
      onPointerUp={handleRelease}
      onPointerCancel={handleRelease}
      style={{
        width: thumbstickConfig.padSize * 2,
        height: thumbstickConfig.padSize * 2,
        touchAction: 'none',
      }}
      className={cn(
        'absolute bottom-6 left-5 z-30 grid place-items-center rounded-full',
        'bg-white/25 ring-1 ring-white/45 ring-inset backdrop-blur-md',
        'transition-opacity duration-500 select-none',
        isHidden ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100',
        isHeld && 'bg-white/35',
      )}
    >
      <span
        ref={knobRef}
        className={cn(
          'size-11 rounded-full bg-white/70 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.7)]',
          'ring-1 ring-white/70 ring-inset',
          isHeld ? 'transition-none' : 'transition-transform duration-300 ease-out',
        )}
      />
    </div>
  )
}
