export const cameraConfig = {
  near: 0.1,
  far: 320,
  target: [0, 1.2, 0] as [number, number, number],
  distance: 34,
  polarAngle: Math.PI / 3,
  azimuth: Math.PI / 4,
}

export const lightConfig = {
  hemisphere: {
    skyColor: '#cfe3f2',
    groundColor: '#3f6236',
    intensity: 0.95,
  },
  directional: {
    color: '#ffeec2',
    intensity: 2.6,
    position: [18, 26, 10] as [number, number, number],
  },
}

export const shadowConfig = {
  highMapSize: 2048,
  lowMapSize: 1024,
  area: 22,
  near: 1,
  far: 70,
  bias: -0.0012,
  normalBias: 0.02,
}

export const physicsConfig = {
  gravity: [0, -9.81, 0] as [number, number, number],
  timeStep: 1 / 60,
  isDebugVisible: false,
}
