interface IslandLevel {
  y: number
  scale: number
  square: number
  jitter: number
  rise: number
  ridge: number
  drift: number
  color: string
}

export const islandConfig = {
  segments: 8,
  levels: [
    { y: 0, scale: 1, square: 1, jitter: 0, rise: 0, ridge: 0, drift: 0, color: '#46301f' },
    {
      y: -1.7,
      scale: 0.93,
      square: 0.86,
      jitter: 0.07,
      rise: 0.5,
      ridge: 0.06,
      drift: 0.3,
      color: '#5b3f28',
    },
    {
      y: -4.7,
      scale: 0.67,
      square: 0.44,
      jitter: 0.11,
      rise: 1.1,
      ridge: 0.11,
      drift: 0.95,
      color: '#7b6045',
    },
    {
      y: -8,
      scale: 0.36,
      square: 0.14,
      jitter: 0.14,
      rise: 1.15,
      ridge: 0.13,
      drift: 1.7,
      color: '#6a5641',
    },
  ] as IslandLevel[],
  tip: {
    y: -11.9,
    drift: 2.4,
    color: '#544335',
  },
}
