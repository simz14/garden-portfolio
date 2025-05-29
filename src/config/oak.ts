export const oakConfig = {
  x: 5.6,
  y: 4.4,
  trunkHeight: 2.4,
  trunkRadiusTop: 0.3,
  trunkRadiusBottom: 0.46,
  trunkSegments: 9,
  flareRadiusTop: 0.47,
  flareRadiusBottom: 0.92,
  flareHeight: 0.5,
  flareCentreHeight: 0.25,
  flareColor: '#5c3d2a',
  collisionRadius: 0.95,
  branchCollisionRadius: 0.9,
  branchCollisionOffset: 2.4,
}

export const oakBranchConfig = {
  radiusTop: 0.08,
  radiusBottom: 0.19,
  length: 1.7,
  segments: 6,
  trunkOffset: 0.24,
  dropStep: 0.3,
  topMargin: 0.75,
  baseTilt: 0.62,
  tiltStep: 0.16,
  baseScale: 0.86,
  scaleStep: 0.12,
  angles: [0.35, 1.75, 3.05, 4.4, 5.5],
}

export const oakCanopyConfig = {
  swaySpeed: 0.6,
  swayAngle: 0.05,
  bobSpeed: 0.9,
  bobHeight: 0.04,
  phaseStep: 0.9,
  focusLift: 0.55,
  focusGrowth: 0.07,
  blobs: [
    { at: [0, 0.5, 0], radius: 1.7, color: 0, shape: 0, squash: 0.88 },
    { at: [-0.9, 0.1, -0.8], radius: 1.25, color: 1, shape: 1, squash: 0.92 },
    { at: [1, -0.05, 0.8], radius: 1.3, color: 2, shape: 2, squash: 0.86 },
    { at: [0.8, 0.75, -0.9], radius: 1, color: 3, shape: 0, squash: 0.94 },
    { at: [-0.9, 0.7, 0.9], radius: 0.95, color: 4, shape: 1, squash: 0.9 },
    { at: [0.1, 1.35, 0.1], radius: 1.15, color: 5, shape: 2, squash: 0.82 },
    { at: [1.55, 0.3, -0.15], radius: 0.78, color: 2, shape: 1, squash: 0.9 },
    { at: [-1.5, 0.45, 0.25], radius: 0.82, color: 0, shape: 2, squash: 0.88 },
    { at: [0.25, 0.05, 1.5], radius: 0.8, color: 4, shape: 0, squash: 0.92 },
    { at: [-0.3, 0.2, -1.5], radius: 0.74, color: 3, shape: 1, squash: 0.9 },
    { at: [0.95, 1.15, 0.75], radius: 0.68, color: 5, shape: 2, squash: 0.86 },
    { at: [-0.85, 1.1, -0.6], radius: 0.62, color: 1, shape: 0, squash: 0.94 },
    { at: [0.05, -0.35, 0.35], radius: 0.9, color: 2, shape: 2, squash: 0.9 },
    { at: [-0.55, -0.4, -0.4], radius: 0.72, color: 3, shape: 1, squash: 0.88 },
  ] as { at: [number, number, number], radius: number, color: number, shape: number, squash: number }[],
}

export const oakLightConfig = {
  color: '#ffeccb',
  focusIntensity: 5,
  distance: 9,
  decay: 1.5,
  offset: [0.9, -0.2, -0.9] as [number, number, number],
}

export const oakBenchConfig = {
  at: [2.4, 0, -2.4] as [number, number, number],
  facing: [0.55, 0, 0.84] as [number, number, number],
  seatTop: 0.56,
  standDistance: 1.45,
  seatShift: 0.16,
  hipDrop: 0.2,
  seatSink: 0.06,
  legSize: [0.14, 0.44, 0.14] as [number, number, number],
  legPositions: [
    [-0.68, 0.22, -0.15],
    [0.68, 0.22, -0.15],
    [-0.68, 0.22, 0.19],
    [0.68, 0.22, 0.19],
  ] as [number, number, number][],
  seat: {
    position: [0, 0.5, -0.02] as [number, number, number],
    size: [1.7, 0.12, 0.56] as [number, number, number],
  },
  back: {
    position: [0, 0.81, 0.25] as [number, number, number],
    size: [1.7, 0.5, 0.1] as [number, number, number],
  },
}

export const oakLeafConfig = {
  clusterCount: 11,
  bladesPerCluster: 3,
  baseDistance: 1.55,
  distanceSwing: 0.45,
  angleJitter: 0.26,
  bladeSpread: 0.18,
  bladeStep: 2.1,
  baseSize: 0.3,
  sizeSwing: 0.06,
  height: 0.12,
  tilt: 0.32,
  colors: ['#33682d', '#3d7a35'],
}
