import { gardenConfig } from '../config/garden'
import { fenceConfig } from '../config/terrain'
import { getWorldOffset } from './garden'

export function getPostOffsets() {
  return Array.from(
    { length: gardenConfig.gridSize },
    (_, index) => getWorldOffset(index) + fenceConfig.postOffset,
  )
}

export function getPostEdge() {
  return getWorldOffset(0) + fenceConfig.postInset
}

export function getRailEdge() {
  return getPostEdge() + fenceConfig.railOffset
}
