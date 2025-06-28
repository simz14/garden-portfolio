export const cameraConfig = {
  near: 0.1,
  far: 320,
  target: [0, 1.2, 0] as [number, number, number],
  distance: 34,
  polarAngle: Math.PI / 3,
  topPolarAngle: Math.PI / 8,
  azimuth: Math.PI / 4,
  azimuthRange: 0.42,
  fitWidth: 40,
  minFitHeight: 26,
  maxFitHeight: 34,
  smoothTime: 0.35,
}

export const cameraFocusConfig = {
  durationSeconds: 1.1,
  polarAngle: Math.PI / 2 - Math.PI / 9,
  zoom: 2.2,
  fogNear: 62,
  fogFar: 110,
  portraitLift: 0.16,
}

export const cameraFollowConfig = {
  deadzone: 0.45,
  rate: 3.2,
  minAxisGain: 0.05,
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

export const fogConfig = {
  fogColor: '#eaf0cd',
  fogNear: 46,
  fogFar: 82,
}

export const physicsConfig = {
  gravity: [0, -9.81, 0] as [number, number, number],
  timeStep: 1 / 60,
  isDebugVisible: false,
}
