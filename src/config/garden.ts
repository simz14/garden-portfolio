export const gardenConfig = {
  gridSize: 24,
  walkMargin: 1,
}

export const paletteConfig = {
  grass: ['#568f42', '#4c8339', '#5f9a4a', '#457a34'],
  stone: ['#c6b79f', '#b8a88e', '#d2c4ac'],
  soil: '#4a3122',
  accent: '#8a5abf',
  flag: '#d62f2f',
  pot: '#c05f33',
  base: '#b5a288',
  glass: '#cadfe8',
  frame: '#6d7f88',
  canopy: ['#2f6b34', '#3c7d38', '#275b2b', '#498c3d', '#346f33', '#559041'],
  timber: '#8a5c33',
  bark: '#68432d',
  fence: '#a97d4a',
  rail: '#bd8d51',
  shrub: ['#3d7a38', '#4d9040'],
}

export const pathConfig = {
  columns: [
    { x: 14, fromY: 5, toY: 21 },
    { x: 6, fromY: 4, toY: 8 },
  ],
  rows: [
    { y: 8, fromX: 6, toX: 14 },
    { y: 5, fromX: 14, toX: 18 },
    { y: 14, fromX: 4, toX: 14 },
    { y: 18, fromX: 14, toX: 19 },
  ],
}

export const shrubConfig = {
  radius: 0.85,
  positions: [
    [1.6, 12],
    [2.2, 20],
    [21, 12.5],
    [10, 21],
    [1.8, 6.6],
    [21.6, 9],
  ] as [number, number][],
}

export const obstacleConfig = {
  wallHeight: 3,
}

export const groundTextureConfig = {
  size: 2048,
  bladeCount: 24000,
}
