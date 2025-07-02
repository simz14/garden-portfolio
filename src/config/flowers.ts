export interface PetalRing {
  count: number
  offset: number
  radius: number
  height: number
  tilt: number
  size: [number, number, number]
}

interface FlowerShape {
  stalkScale: number
  blades: { height: number, length: number }
  petalRings: PetalRing[]
  heart: {
    position: [number, number, number]
    scale: [number, number, number]
    usesPetalColor?: boolean
  }
  outerLeaves?: {
    spins: number[]
    radius: number
    height: number
    tilt: number
    size: [number, number, number]
  }
}

export const flowerConfig = {
  petalSegments: [1, 5] as [number, number],
  heartSegments: [8, 6] as [number, number],
  stalkRadiusTop: 0.02,
  stalkRadiusBottom: 0.028,
  stalkSegments: 5,
  stalkRoot: 0.3,
  bladeTilt: 0.28,
  bladeOffset: 0.05,
  bladeWidth: 0.035,
  bladeDepth: 0.09,
  bladeShrink: 0.82,
}

export const flowerShapeConfig: Record<'tulip' | 'rose' | 'field', FlowerShape> = {
  tulip: {
    stalkScale: 0.54,
    blades: { height: 0.24, length: 0.26 },
    petalRings: [
      { count: 6, offset: 0, radius: 0.085, height: 0.7, tilt: 0.22, size: [0.11, 0.19, 0.05] },
    ],
    heart: { position: [0, 0.6, 0], scale: [0.12, 0.09, 0.12], usesPetalColor: true },
  },
  rose: {
    stalkScale: 0.44,
    blades: { height: 0.2, length: 0.2 },
    petalRings: [
      { count: 5, offset: 0, radius: 0.05, height: 0.53, tilt: 0.18, size: [0.075, 0.1, 0.035] },
      { count: 6, offset: 0.5, radius: 0.11, height: 0.5, tilt: 0.66, size: [0.09, 0.1, 0.03] },
      { count: 7, offset: 0.25, radius: 0.17, height: 0.46, tilt: 1.12, size: [0.1, 0.11, 0.03] },
    ],
    heart: { position: [0, 0.55, 0], scale: [0.045, 0.045, 0.045] },
    outerLeaves: {
      spins: [0, 2.1, 4.2],
      radius: 0.13,
      height: 0.44,
      tilt: 1.35,
      size: [0.05, 0.07, 0.025],
    },
  },
  field: {
    stalkScale: 0.36,
    blades: { height: 0.15, length: 0.14 },
    petalRings: [
      { count: 8, offset: 0, radius: 0.075, height: 0.365, tilt: 1.36, size: [0.045, 0.085, 0.02] },
    ],
    heart: { position: [0, 0.375, 0], scale: [0.055, 0.038, 0.055] },
  },
}
