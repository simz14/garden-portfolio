import { cameraConfig } from '../config/scene'

export function getOrbitPosition(polarAngle: number, azimuth: number, distance: number) {
  const sinPolar = Math.sin(polarAngle)

  return [
    distance * sinPolar * Math.sin(azimuth),
    distance * Math.cos(polarAngle),
    distance * sinPolar * Math.cos(azimuth),
  ] as [number, number, number]
}

export function getHomePosition() {
  return getOrbitPosition(cameraConfig.polarAngle, cameraConfig.azimuth, cameraConfig.distance)
}
