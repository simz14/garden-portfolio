import { cameraConfig } from './scene'
import { shedConfig } from './shed'
import { getWorldOffset } from '../utils/garden'

const sideOffset = 4.6

export const techConfig = {
  primaryCount: 6,
  pinnedPadding: 12,
  anchor: [
    getWorldOffset(shedConfig.x + shedConfig.width / 2) + Math.sin(cameraConfig.azimuth) * sideOffset,
    1.6,
    getWorldOffset(shedConfig.y + shedConfig.depth / 2) - Math.cos(cameraConfig.azimuth) * sideOffset,
  ] as [number, number, number],
}
