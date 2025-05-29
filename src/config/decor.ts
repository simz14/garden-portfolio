export const wildflowerConfig = {
  seedOffset: 4001,
  minSpread: 0.5,
  spreadSwing: 0.9,
  minScale: 0.75,
  scaleSwing: 0.5,
  tiltSwing: 0.3,
  colors: [
    { petal: '#fffbec', heart: '#ffb81f', stem: '#4a8a3e' },
    { petal: '#4560c9', heart: '#232c63', stem: '#45803a' },
    { petal: '#f0a814', heart: '#a35f10', stem: '#4f8f42' },
  ],
  patches: [
    [2.6, 3.2, 9],
    [10.5, 3.5, 7],
    [20.4, 14.6, 8],
    [3.4, 21.2, 9],
    [16.8, 21.4, 7],
    [1.5, 16.5, 6],
    [22, 6.4, 6],
    [11.8, 19.6, 10],
  ] as [number, number, number][],
}

export const shrubShapeConfig = {
  seedOffset: 8009,
  mounds: [
    { at: [0, 0.44, 0] as [number, number, number], radius: 0.74 },
    { at: [0.46, 0.62, -0.3] as [number, number, number], radius: 0.52 },
    { at: [-0.42, 0.5, 0.36] as [number, number, number], radius: 0.5 },
    { at: [0.18, 0.86, 0.16] as [number, number, number], radius: 0.42 },
    { at: [-0.28, 0.32, -0.46] as [number, number, number], radius: 0.44 },
    { at: [0.34, 0.3, 0.5] as [number, number, number], radius: 0.4 },
  ],
  berryCount: 5,
  berryRadius: 0.075,
  berryColor: '#cbb2f0',
  berrySpread: 1.3,
  berryMinHeight: 0.55,
  berryHeightSwing: 0.5,
}
