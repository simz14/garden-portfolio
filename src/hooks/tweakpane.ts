import { useEffect, useRef } from 'react'
import { Pane } from 'tweakpane'
import type { FolderApi } from 'tweakpane'
import { debugConfig } from '../config/debug'

let pane: Pane | null = null
let host: HTMLElement | null = null
let folderCount = 0
let isPanelVisible = false

function applyPanelVisibility() {
  if (host) {
    host.style.display = isPanelVisible ? '' : 'none'
  }
}

export function setPanelVisible(isVisible: boolean) {
  isPanelVisible = isVisible
  applyPanelVisibility()
}

function openPane() {
  if (pane) {
    folderCount += 1

    return pane
  }

  host = document.createElement('div')
  host.style.cssText = debugConfig.hostStyle
  document.body.appendChild(host)
  const isRoomy = window.innerWidth >= debugConfig.roomyWidth

  pane = new Pane({ container: host, title: debugConfig.title, expanded: isRoomy })
  folderCount = 1

  applyPanelVisibility()

  return pane
}

function closePane() {
  folderCount -= 1

  if (folderCount > 0) {
    return
  }

  pane?.dispose()
  host?.remove()
  pane = null
  host = null
}

export function useDebugFolder(title: string, build: (folder: FolderApi) => void) {
  const buildRef = useRef(build)

  buildRef.current = build

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return
    }

    const folder = openPane().addFolder({ title })

    buildRef.current(folder)

    return function disposeFolder() {
      folder.dispose()
      closePane()
    }
  }, [title])
}
