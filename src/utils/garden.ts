import { gardenConfig } from '../config/garden'

export function getWorldOffset(gridValue: number) {
  return gridValue - gardenConfig.gridSize / 2
}

export function getWalkBound() {
  return gardenConfig.gridSize / 2 - gardenConfig.walkMargin
}
