import { BufferAttribute, Color, IcosahedronGeometry, Vector3 } from 'three'
import type { BufferGeometry } from 'three'

export interface Placement {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
}

export function createLumpyBall(detail: number, amount: number, frequency: number) {
  const geometry = new IcosahedronGeometry(1, detail)
  const position = geometry.attributes.position
  const vertex = new Vector3()

  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index)

    const wobble =
      Math.sin(vertex.x * frequency + vertex.y * 1.7) *
      Math.cos(vertex.z * frequency * 0.8 - vertex.y * 2.1)

    vertex.multiplyScalar(1 + wobble * amount)
    position.setXYZ(index, vertex.x, vertex.y, vertex.z)
  }

  geometry.computeVertexNormals()

  return geometry
}

export function paintGeometry(geometry: BufferGeometry, hex: string) {
  const color = new Color(hex)
  const count = geometry.attributes.position.count
  const colors = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    colors[index * 3] = color.r
    colors[index * 3 + 1] = color.g
    colors[index * 3 + 2] = color.b
  }

  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  return geometry
}

export function createClump(
  getRandom: () => number,
  position: [number, number, number],
  radius: number,
): Placement {
  return {
    position,
    scale: [radius, radius * (0.78 + getRandom() * 0.2), radius * (0.9 + getRandom() * 0.2)],
    rotation: [getRandom() * Math.PI, getRandom() * Math.PI, getRandom() * Math.PI],
  }
}
