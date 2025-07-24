import { useEffect } from 'react'
import { getDebugState, setDebugState, useDebugState } from '../../../hooks/debug'
import { setPanelVisible } from '../../../hooks/tweakpane'
import { cn } from '../../../utils/cn'

export function DebugToggle() {
  const { isPanelVisible } = useDebugState()

  useEffect(() => {
    setPanelVisible(isPanelVisible)
  }, [isPanelVisible])

  return (
    <button

      type="button"
      role="switch"
      aria-checked={isPanelVisible}
      aria-label="Debug panel"
      onClick={() => setDebugState({ isPanelVisible: !getDebugState().isPanelVisible })}
      className="flex cursor-pointer items-center gap-2"
    >
      <span
        className={cn(
          'font-mono text-[10px] tracking-[0.18em] uppercase transition-colors',
          isPanelVisible ? 'text-foreground' : 'text-foreground/40',
        )}
      >
        debug
      </span>

      <span
        className={cn(
          'flex h-5 w-9 items-center rounded-full p-0.5 ring-1 ring-inset transition-colors',
          isPanelVisible ? 'bg-accent ring-accent' : 'bg-foreground/10 ring-foreground/20',
        )}
      >
        <span
          className={cn(
            'size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out',
            isPanelVisible ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </span>
    </button>
  )
}
