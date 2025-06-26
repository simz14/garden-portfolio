import { useCallback, useEffect, useRef, useState } from 'react'
import { useCursor } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { Group } from 'three'
import type { HotspotId } from '../config/hotspots'
import { getIsCameraDragging } from './camera'
import { getGarden, selectHotspot, setGarden } from './garden'
import { useHotspotRegistry } from './hotspots'

export function useZone(id: HotspotId) {
  const { registerHotspotGroup, setPointerHotspot, getPointerHotspot } = useHotspotRegistry()
  const [isHovered, setIsHovered] = useState(false)
  const pendingLeave = useRef(0)

  useCursor(isHovered)

  useEffect(() => {
    return function cancelPendingLeave() {
      cancelAnimationFrame(pendingLeave.current)
    }
  }, [])

  const ref = useCallback(
    (group: Group | null) => {
      if (!group) {
        return
      }

      return registerHotspotGroup(id, group)
    },
    [id, registerHotspotGroup],
  )

  function handlePointerOver(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation()
    cancelAnimationFrame(pendingLeave.current)
    setPointerHotspot(id)
    setGarden({ hovered: id })
    setIsHovered(true)
  }

  function handlePointerOut() {
    cancelAnimationFrame(pendingLeave.current)

    pendingLeave.current = requestAnimationFrame(() => {
      if (getPointerHotspot() === id) {
        setPointerHotspot(null)
        setGarden({ hovered: null })
      }

      setIsHovered(false)
    })
  }

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()

    const canSelect = getGarden().isReady && !getIsCameraDragging()

    if (!canSelect) {
      return
    }

    selectHotspot(id)
  }

  return {
    ref,
    onPointerOver: handlePointerOver,
    onPointerOut: handlePointerOut,
    onClick: handleClick,
  }
}
