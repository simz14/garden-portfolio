import { gardenConfig, pathConfig } from '../config/garden'

export function getWorldOffset(gridValue: number) {
  return gridValue - gardenConfig.gridSize / 2
}

export function getWalkBound() {
  return gardenConfig.gridSize / 2 - gardenConfig.walkMargin
}

export function createPathTiles() {
  const tiles = new Set<string>()

  for (const { x, fromY, toY } of pathConfig.columns) {
    for (let y = fromY; y <= toY; y += 1) {
      tiles.add(`${x},${y}`)
    }
  }

  for (const { y, fromX, toX } of pathConfig.rows) {
    for (let x = fromX; x <= toX; x += 1) {
      tiles.add(`${x},${y}`)
    }
  }

  return tiles
}
