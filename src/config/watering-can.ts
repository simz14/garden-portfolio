import { getWorldOffset } from '../utils/garden'

export const wateringCanConfig = {
  rest: [getWorldOffset(13.1), 0.6, getWorldOffset(14.2)] as [number, number, number],
  restYaw: 0.6,
  tipAngle: 0.95,
  spout: [0.66, 0.07, 0] as [number, number, number],
  spoutAngle: 0.98,
  standOffset: [-0.86, -0.48] as [number, number],
  postRadius: 0.34,
  tinColor: '#4d879e',
  bodyColor: '#5f97b0',
  roseColor: '#3f7789',
  body: { radiusTop: 0.24, radiusBottom: 0.26, height: 0.42, segments: 12, y: -0.25 },
  rim: { radius: 0.255, height: 0.045, segments: 12, y: -0.045 },
  handle: { radius: 0.2, tube: 0.028, y: -0.05 },
  grip: { radius: 0.11, tube: 0.024, arc: Math.PI * 1.1, at: [-0.26, -0.22, 0] as [number, number, number] },
  spoutShape: { radiusTop: 0.05, radiusBottom: 0.075, length: 0.58, segments: 8, at: [0.36, -0.14, 0] as [number, number, number] },
  rose: { radiusTop: 0.095, radiusBottom: 0.07, height: 0.08, segments: 10, at: [0.62, 0.04, 0] as [number, number, number] },
}

export const dropletConfig = {
  count: 30,
  lifeSeconds: 0.9,
  spawnInterval: 0.035,
  color: '#7cc9e4',
  opacity: 0.85,
  gravity: 5.5,
  spread: 0.12,
  minForward: 1.15,
  forwardSwing: 0.55,
  minFall: 0.25,
  fallSwing: 0.25,
  minSize: 0.034,
  sizeFromLife: 0.016,
  stretch: 2.1,
  pourThreshold: 0.4,
}
