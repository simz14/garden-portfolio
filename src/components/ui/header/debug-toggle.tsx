import { useEffect } from 'react'
import { getDebugState, setDebugState, useDebugState } from '../../../hooks/debug'
import { setPanelVisible } from '../../../hooks/tweakpane'

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
      className="cursor-pointer font-mono text-[10px] tracking-[0.18em] uppercase"
    >
      debug
    </button>
  )
}
