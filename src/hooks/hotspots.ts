import type { Group } from 'three'
import type { HotspotId } from '../config/hotspots'

const groupsByHotspot = new Map<HotspotId, Group>()

let pointerHotspot: HotspotId | null = null
let nearbyHotspot: HotspotId | null = null

function registerHotspotGroup(id: HotspotId, group: Group) {
  groupsByHotspot.set(id, group)

  return function unregisterHotspotGroup() {
    groupsByHotspot.delete(id)
  }
}

function getHotspotGroup(id: HotspotId) {
  return groupsByHotspot.get(id)
}

function setPointerHotspot(id: HotspotId | null) {
  pointerHotspot = id
}

function getPointerHotspot() {
  return pointerHotspot
}

function setNearbyHotspot(id: HotspotId | null) {
  nearbyHotspot = id
}

function getNearbyHotspot() {
  return nearbyHotspot
}

function getFocusedHotspot() {
  return pointerHotspot ?? nearbyHotspot
}

export function useHotspotRegistry() {
  return {
    registerHotspotGroup,
    getHotspotGroup,
    setPointerHotspot,
    getPointerHotspot,
    setNearbyHotspot,
    getNearbyHotspot,
    getFocusedHotspot,
  }
}
