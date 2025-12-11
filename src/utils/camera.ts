import { MathUtils } from 'three'
import { cameraConfig } from '../config/scene'

export function getFittedZoom(width: number, height: number) {
  const widthZoom = width / cameraConfig.fitWidth
  const minHeightZoom = height / cameraConfig.maxFitHeight
  const maxHeightZoom = height / cameraConfig.minFitHeight

  return MathUtils.clamp(widthZoom, minHeightZoom, maxHeightZoom)
}
