import { useEffect, useMemo, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { talkConfig } from '../../../config/labels'
import { useIsTouch } from '../../../hooks/device'
import { useGarden } from '../../../hooks/garden'
import { profileData } from '../../../data/profile'
import { cn } from '../../../utils/cn'

const above = { transform: 'translate(-50%, -100%)' } as const

export function GardenerTalk() {
  const { t } = useTranslation()
  const isTouch = useIsTouch()

  const isReady = useGarden((state) => state.isReady)
  const isGreeting = useGarden((state) => state.isGreeting)
  const isSeated = useGarden((state) => state.isSeated)

  const [saidCount, setSaidCount] = useState(0)
  const [isPinned, setIsPinned] = useState(true)
  const stackRef = useRef<HTMLUListElement>(null)

  const lines = useMemo(
    () =>
      t('about.speech', {
        returnObjects: true,
        age: dayjs().diff(profileData.birthDate, 'year'),
      }) as string[],
    [t],
  )

  useEffect(() => {
    if (!isSeated) {
      return
    }

    const timers = Array.from({ length: lines.length - 1 }, (_, index) =>
      setTimeout(() => setSaidCount(index + 2), (index + 1) * talkConfig.lineGapMs),
    )

    return function clearTimers() {
      for (const timer of timers) {
        clearTimeout(timer)
      }

      setSaidCount(0)
      setIsPinned(true)
    }
  }, [isSeated, lines.length])

  const spokenCount = isSeated ? Math.max(1, saidCount) : 0
  const isThinking = spokenCount > 0 && spokenCount < lines.length

  useEffect(() => {
    const stack = stackRef.current

    const shouldFollowLatest = stack !== null && isPinned

    if (!shouldFollowLatest) {
      return
    }

    stack.scrollTo({ top: stack.scrollHeight, behavior: 'smooth' })
  }, [spokenCount, isPinned])

  function handleScroll() {
    const stack = stackRef.current

    if (!stack) {
      return
    }

    setIsPinned(
      stack.scrollHeight - stack.scrollTop - stack.clientHeight < talkConfig.pinSlack,
    )
  }

  return (
    <>
      <Html position-y={talkConfig.greetingHeight} zIndexRange={[40, 30]} pointerEvents="none" style={{ pointerEvents: 'none' }}>
        <div
          style={above}
          className={cn(
            'pointer-events-none w-52 max-w-[70vw] rounded-lg bg-background/95 px-4 py-3 shadow-xl ring-1 ring-foreground/10 transition-opacity duration-700 sm:w-56',
            isReady && isGreeting ? 'opacity-100' : 'opacity-0',
          )}
        >
          <p className="text-sm font-medium">{t('greeting.title')}</p>
          <p className="mt-1 text-xs text-foreground/70">
            {t(isTouch ? 'greeting.bodyTouch' : 'greeting.body')}
          </p>
          <span className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-background/95" />
        </div>
      </Html>

      <Html position-y={talkConfig.speechHeight} zIndexRange={[40, 30]} pointerEvents="none" style={{ pointerEvents: 'none' }}>
        <ul
          ref={stackRef}
          onScroll={handleScroll}
          aria-live="polite"
          style={above}
          className={cn(
            'ml-14 flex w-64 max-w-[74vw] flex-col items-start gap-2 sm:ml-28 sm:w-72',
            'h-44 overflow-y-auto overscroll-contain px-3 pb-4 sm:h-52 [&::-webkit-scrollbar]:hidden [&>li:first-child]:mt-auto',
            'mask-[linear-gradient(to_bottom,transparent,black_3rem)]',
            spokenCount > 0 ? 'pointer-events-auto' : 'pointer-events-none',
          )}
        >
          {lines.slice(0, spokenCount).map((line, index) => (
            <li
              key={line}
              className={cn(
                'animate-pop relative rounded-[1.4rem] rounded-bl-md bg-background/85 px-4 py-2.5 text-[13px] leading-relaxed text-foreground',
                'shadow-[0_12px_32px_-18px_rgba(0,0,0,0.65)] ring-1 ring-foreground/10 backdrop-blur-xl transition-opacity duration-700',
                index === spokenCount - 1 ? 'opacity-100' : 'opacity-55',
              )}
            >
              {line}

              {index === spokenCount - 1 && !isThinking && (
                <>
                  <span className="absolute -bottom-1.5 left-2 size-3 rounded-full bg-background/85 ring-1 ring-foreground/10 backdrop-blur-xl" />
                  <span className="absolute -bottom-4 left-0 size-1.5 rounded-full bg-background/70 ring-1 ring-foreground/10" />
                </>
              )}
            </li>
          ))}

          {isThinking && (
            <li className="animate-pop flex items-center gap-1.5 rounded-full bg-background/70 px-3.5 py-2.5 shadow-[0_10px_28px_-20px_rgba(0,0,0,0.6)] ring-1 ring-foreground/10 backdrop-blur-xl">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  style={{ animationDelay: `${dot * 170}ms` }}
                  className="animate-think size-1.5 rounded-full bg-foreground/60"
                />
              ))}
            </li>
          )}

          {spokenCount > 0 && !isPinned && (
            <li className="sticky bottom-0 self-center">
              <button

                type="button"
                onClick={() => setIsPinned(true)}
                className="cursor-pointer animate-pop rounded-full bg-foreground/85 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-background uppercase transition-colors hover:bg-foreground"
              >
                {t('about.follow')}
              </button>
            </li>
          )}
        </ul>
      </Html>
    </>
  )
}
