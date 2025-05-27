import {

  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
} from 'three'
import { gardenConfig, groundTextureConfig, paletteConfig } from '../config/garden'

export function createGroundTexture(getRandom: () => number) {
  const { size, bladeCount } = groundTextureConfig
  const canvas = document.createElement('canvas')

  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  const tileSize = size / gardenConfig.gridSize

  for (let y = 0; y < gardenConfig.gridSize; y += 1) {
    for (let x = 0; x < gardenConfig.gridSize; x += 1) {
      const shade = (x * 3 + y * 5 + Math.floor(getRandom() * 3)) % paletteConfig.grass.length

      context.fillStyle = paletteConfig.grass[shade]
      context.fillRect(x * tileSize, y * tileSize, tileSize + 1, tileSize + 1)
    }
  }

  for (let index = 0; index < bladeCount; index += 1) {
    const red = (40 + getRandom() * 36) | 0
    const green = (86 + getRandom() * 48) | 0
    const blue = (34 + getRandom() * 28) | 0
    const alpha = 0.28 + getRandom() * 0.4

    context.fillStyle = `rgba(${red},${green},${blue},${alpha})`
    context.fillRect(
      getRandom() * size,
      getRandom() * size,
      2 + getRandom() * 4,
      1 + getRandom() * 3,
    )
  }

  const texture = new CanvasTexture(canvas)

  texture.colorSpace = SRGBColorSpace
  texture.magFilter = LinearFilter
  texture.minFilter = LinearMipmapLinearFilter

  return texture
}
