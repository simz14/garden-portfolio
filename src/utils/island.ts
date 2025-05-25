import {

  BufferGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  Vector2,
  Vector3,
} from 'three'
import { gardenConfig } from '../config/garden'
import { islandConfig } from '../config/island'

export function createIslandUnderside(getRandom: () => number) {
  const { segments, levels, tip } = islandConfig
  const halfGrid = gardenConfig.gridSize / 2

  const wobble = levels.map((level) =>
    Array.from({ length: segments }, (_, index) => ({
      radius:
        1 +
        (getRandom() - 0.5) * 2 * level.jitter +
        (index % 2 ? -level.ridge : level.ridge),
      y: (getRandom() - 0.5) * 2 * level.rise,
    })),
  )

  const lean = levels.map((level) => {
    const angle = getRandom() * Math.PI * 2

    return new Vector2(Math.cos(angle), Math.sin(angle)).multiplyScalar(level.drift)
  })

  const tipLean = lean[lean.length - 1].clone().normalize().multiplyScalar(tip.drift)

  function getRingVertex(levelIndex: number, segmentIndex: number) {
    const level = levels[levelIndex]
    const angle = (segmentIndex / segments) * Math.PI * 2
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const squareRadius = halfGrid / Math.max(Math.abs(cos), Math.abs(sin))
    const offset = wobble[levelIndex][segmentIndex % segments]
    const radius =
      MathUtils.lerp(halfGrid, squareRadius, level.square) * level.scale * offset.radius
    const drift = lean[levelIndex]

    return new Vector3(cos * radius + drift.x, level.y + offset.y, sin * radius + drift.y)
  }

  const positions: number[] = []
  const colors: number[] = []
  const tint = new Color()

  function addFace(a: Vector3, b: Vector3, c: Vector3, color: string) {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
    tint.set(color).multiplyScalar(0.93 + getRandom() * 0.14)

    for (let corner = 0; corner < 3; corner += 1) {
      colors.push(tint.r, tint.g, tint.b)
    }
  }

  for (let levelIndex = 0; levelIndex < levels.length - 1; levelIndex += 1) {
    for (let segmentIndex = 0; segmentIndex < segments; segmentIndex += 1) {
      const upperStart = getRingVertex(levelIndex, segmentIndex)
      const upperEnd = getRingVertex(levelIndex, segmentIndex + 1)
      const lowerEnd = getRingVertex(levelIndex + 1, segmentIndex + 1)
      const lowerStart = getRingVertex(levelIndex + 1, segmentIndex)
      const color = levels[levelIndex + 1].color

      addFace(upperStart, upperEnd, lowerEnd, color)
      addFace(upperStart, lowerEnd, lowerStart, color)
    }
  }

  const tipVertex = new Vector3(tipLean.x, tip.y, tipLean.y)
  const lastLevel = levels.length - 1

  for (let segmentIndex = 0; segmentIndex < segments; segmentIndex += 1) {
    addFace(
      getRingVertex(lastLevel, segmentIndex),
      getRingVertex(lastLevel, segmentIndex + 1),
      tipVertex,
      tip.color,
    )
  }

  const geometry = new BufferGeometry()

  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.computeVertexNormals()

  return geometry
}
