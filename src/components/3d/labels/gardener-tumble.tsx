import { useEffect, useMemo } from 'react'
import { Html } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import { talkConfig } from '../../../config/labels'
import { Tumble, setGarden, useGarden } from '../../../hooks/garden'
import { cn } from '../../../utils/cn'

const above = { transform: 'translate(-50%, -100%)' } as const
const falling = { transform: 'translate(10%, -320%)' } as const

export function GardenerTumble() {
  const { t } = useTranslation()

  const tumble = useGarden((state) => state.tumble)
  const tumbleCount = useGarden((state) => state.tumbleCount)

  const falls = useMemo(
    () => t('tumble.falling', { returnObjects: true }) as string[],
    [t],
  )
  const returns = useMemo(
    () => t('tumble.recovered', { returnObjects: true }) as string[],
    [t],
  )

  useEffect(() => {
    if (tumble !== Tumble.Recovered) {
      return
    }

    const timer = setTimeout(() => setGarden({ tumble: Tumble.None }), talkConfig.tumbleMs)

    return function clearTimer() {
      clearTimeout(timer)
    }
  }, [tumble, tumbleCount])

  if (tumble === Tumble.None) {
    return null
  }

  const isFalling = tumble === Tumble.Falling
  const lines = isFalling ? falls : returns
  const line = lines[tumbleCount % lines.length]

  return (
    <Html
      position-y={talkConfig.greetingHeight}
      zIndexRange={[40, 30]}
      pointerEvents="none"
      style={{ pointerEvents: 'none' }}
    >
      <div
        style={isFalling ? falling : above}
        className={cn(
          'animate-pop pointer-events-none w-max max-w-[60vw] rounded-[1.4rem] rounded-bl-md bg-background/90 px-4 py-2.5',
          'text-[13px] leading-relaxed font-medium text-foreground shadow-xl ring-1 ring-foreground/10 backdrop-blur-xl',
        )}
      >
        {line}
        <span className="absolute -bottom-1.5 left-2 size-3 rounded-full bg-background/90 ring-1 ring-foreground/10 backdrop-blur-xl" />
      </div>
    </Html>
  )
}
