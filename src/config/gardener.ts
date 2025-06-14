import { getWorldOffset } from '../utils/garden'

export const gardenerConfig = {
  scale: 1.6,
  skirtHeight: 0.32,
  home: [getWorldOffset(14.5), 0, getWorldOffset(8.5)] as [number, number, number],
  facing: Math.PI / 4,
  armLength: 0.28,
  legLength: 0.16,
  armRestZ: 0.16,
  armRaisedZ: 2.35,
  skinColor: '#f2d2b3',
  dressColor: '#e05a83',
  hairColor: '#d99f2b',
  shoeColor: '#7a522e',
  hatBrimColor: '#dcb45e',
  hatCrownColor: '#e5c273',
}

export const gardenerShapeConfig = {
  skirt: { radiusTop: 0.13, radiusBottom: 0.31, height: 0.4, segments: 12 },
  bodice: { radiusTop: 0.115, radiusBottom: 0.135, height: 0.24, segments: 10, y: 0.62 },
  arm: { radius: 0.036, segments: [5, 10] as [number, number], offset: 0.15, y: 0.71 },
  leg: { radius: 0.042, taper: 0.85, segments: 6, offset: 0.07, y: 0.14 },
  shoulderRadius: 0.045,
  handRadius: 0.058,
  headRadius: 0.115,
  headY: 0.83,
  shoe: {
    position: [0, -0.165, 0.01] as [number, number, number],
    size: [0.1, 0.05, 0.14] as [number, number, number],
  },
  hairCap: {
    radius: 0.132,
    position: [0, 0.845, -0.03] as [number, number, number],
    scale: [1, 0.95, 1] as [number, number, number],
  },
  bun: {
    position: [0, 0.695, -0.085] as [number, number, number],
    scale: [0.136, 0.235, 0.095] as [number, number, number],
  },
  strand: {
    offset: 0.078,
    y: 0.755,
    z: -0.005,
    scale: [0.05, 0.115, 0.058] as [number, number, number],
  },
  hatBrim: { radius: 0.27, height: 0.018, segments: 16, y: 0.93 },
  hatCrown: { radiusTop: 0.1, radiusBottom: 0.125, height: 0.13, segments: 14, y: 0.995 },
  hatRibbon: { radiusTop: 0.13, radiusBottom: 0.132, height: 0.035, segments: 14, y: 0.95 },
}

export const gardenerWalkConfig = {
  speed: 5,
  slowSpeed: 3.6,
  arrivalDistance: 0.08,
  turnRate: 12,
  slowTurnRate: 8,
  colliderRadius: 0.26,
  colliderHeight: 1.1,
  colliderSkin: 0.02,
  fallStartHeight: -1.5,
  fallResetHeight: -30,
}

export const gardenerMotionConfig = {
  strideRate: 3,
  strideBounce: 0.04,
  armSwing: 0.55,
  legSwing: 0.5,
  relaxRate: 10,
  settleRate: 12,
  greetRate: 6.5,
  greetSwing: 0.34,
  greetLean: 0.02,
  greetSettleSeconds: 0.35,
  seatSwayRate: 1.7,
  seatSwaySwing: 0.16,
  carryArmX: -0.5,
  pourArmSwing: 1.45,
}

export const taskTimeConfig = {
  sitSeconds: 1,
  reachSeconds: 0.55,
  postSeconds: 0.9,
  slideSeconds: 0.8,
  carrySeconds: 0.5,
  pourSeconds: 1.9,
}
