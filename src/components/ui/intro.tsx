import { useEffect, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { createIntroDismissTimeline, createIntroRevealTimeline } from '../../animations/intro'
import { useIsReducedMotion, useIsTouch } from '../../hooks/device'
import { enterGarden, useGarden } from '../../hooks/garden'
import { cn } from '../../utils/cn'

export function Intro() {
  const { t } = useTranslation()
  const isTouch = useIsTouch()
  const isReducedMotion = useIsReducedMotion()
  const hasEntered = useGarden((state) => state.hasEntered)
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = root.current

    if (container === null) {
      return
    }

    const timeline = createIntroRevealTimeline(container, isReducedMotion)

    return function killReveal() {
      timeline.kill()
    }
  }, [])

  useEffect(() => {
    const container = root.current

    if (container === null || !hasEntered) {
      return
    }

    const timeline = createIntroDismissTimeline(container, isReducedMotion)

    return function killDismiss() {
      timeline.kill()
    }
  }, [hasEntered])

  return (
    <div
      ref={root}
      aria-hidden={hasEntered}
      className={cn(
        'absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 px-6 text-center',
        hasEntered ? 'pointer-events-none' : 'pointer-events-auto',
      )}
    >
      
      <h1 data-intro-item className="max-w-2xl text-3xl leading-tight text-balance sm:text-5xl">
        {t('title')}
      </h1>

      <p data-intro-item className="max-w-md text-[13px] text-balance text-foreground/55">
        {t(isTouch ? 'hintTouch' : 'hint')}
      </p>

      <button
        data-intro-item
        type="button"
        onClick={enterGarden}
        tabIndex={hasEntered ? -1 : 0}
        className={cn(
          'mt-4 cursor-pointer rounded-full bg-foreground px-6 py-3 text-[11px]',
          'tracking-[0.18em] text-background uppercase transition-colors hover:bg-foreground/85',
        )}
      >
        {t('enter')}
      </button>
    </div>
  )
}
