import { LogoKind } from '../data/logos'

export const shedConfig = {
  x: 16.6,
  y: 2.4,
  width: 3.4,
  depth: 3.2,
  height: 1.9,
  floorHeight: 0.16,
  baseOverhang: 0.15,
  footprintMargin: 0.2,
  dividerWidth: 0.06,
  dividerCount: 3,
  benchHeight: 0.68,
  shelfHeight: 1.25,
  standInset: 0.55,
  standDistance: 1,
}

export const shedDoorConfig = {
  width: 1.5,
  heightRatio: 0.86,
  barWidth: 0.07,
  thickness: 0.04,
  handleColor: '#57666d',
  handleSize: [0.05, 0.28, 0.05] as [number, number, number],
  handleOffset: [-0.215, -0.065] as [number, number],
  handleHeightRatio: 0.42,
  openSeconds: 0.8,
}

export const shedRoofConfig = {
  overhang: 0.2,
  peakHeight: 0.95,
  depthMargin: 0.3,
  restingOpacity: 0.62,
  revealedOpacity: 0.18,
  lift: 0.7,
}

export const shedGlassConfig = {
  restingOpacity: 0.42,
  revealedOpacity: 0.06,
}

export const shedLightConfig = {
  color: '#ffe8bd',
  revealedIntensity: 6,
  distance: 7,
  decay: 1.4,
  heightRatio: 0.75,
}

export const shedBenchConfig = {
  height: 0.62,
  legWidth: 0.08,
  legInset: 0.05,
  topThickness: 0.06,
  legColor: '#7a522e',
  topColor: '#9d6a3a',
}

export const shedTrayConfig = {
  count: 3,
  spacing: 0.95,
  size: [0.8, 0.1, 0.44] as [number, number, number],
  color: '#8a6440',
  soilSize: [0.72, 0.06, 0.36] as [number, number, number],
  soilBase: 0.06,
  seedlingCount: 8,
  seedlingsPerRow: 4,
  seedlingSpacing: [0.18, 0.17] as [number, number],
  seedlingRadius: 0.075,
  seedlingColors: ['#5c9c44', '#4c8a3c'],
}

export const shedShelfConfig = {
  thickness: 0.05,
  depth: 0.34,
  color: '#9d6a3a',
  potCount: 6,
  potSpacing: 0.52,
  potSize: 0.78,
  potColors: ['#6aa84c', '#5c9c44'],
}

export const shedPotConfig = {
  radiusTop: 0.11,
  radiusBottom: 0.085,
  height: 0.17,
  segments: 7,
  foliageRadius: 0.15,
}

export const shedDisplayConfig = {
  benchRowStart: 1.05,
  benchRowSpacing: 0.42,
  benchRowInset: 0.62,
  benchLogoSize: 1.3,
  benchPlantColors: ['#52913e', '#417d38'],
  benchItems: [null, LogoKind.Tailwind, LogoKind.Node, LogoKind.GraphQL, null] as (LogoKind | null)[],
  floorLogos: [
    { kind: LogoKind.React, at: [-0.5, -0.45] as [number, number], size: 1.6 },
    { kind: LogoKind.TypeScript, at: [-0.8, -1.75] as [number, number], size: 1.35 },
    { kind: LogoKind.Next, at: [-1.9, -1.35] as [number, number], size: 1.35 },
  ],
  crate: {
    offset: [-1.5, 0.9] as [number, number],
    size: [0.44, 0.36, 0.34] as [number, number, number],
    color: '#947a52',
  },
  wateringCan: {
    offset: [-0.85, 0.95] as [number, number],
    radiusTop: 0.15,
    radiusBottom: 0.17,
    height: 0.26,
    segments: 9,
    color: '#5f97b0',
  },
}

export const shedPotStackConfig = {
  count: 6,
  radiusTop: 0.24,
  radiusBottom: 0.18,
  height: 0.34,
  segments: 8,
  restingHeight: 0.17,
  origin: [20.2, 6.1] as [number, number],
  spacing: 0.55,
  perRow: 3,
}
