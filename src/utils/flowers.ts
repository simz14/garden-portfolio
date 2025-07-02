import {

  CylinderGeometry,
  Euler,
  Matrix4,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { BufferGeometry } from 'three'
import { flowerConfig, flowerShapeConfig } from '../config/flowers'
import type { PetalRing } from '../config/flowers'
import type { FlowerKind } from '../config/beds'
import { paintGeometry } from './geometry'

export interface FlowerColors {
  petal: string
  heart: string
  stem: string
}

export function createFlower(kind: FlowerKind, colors: FlowerColors): BufferGeometry {
  const shape = flowerShapeConfig[kind]

  const petalBase = new SphereGeometry(1, ...flowerConfig.petalSegments)
  const heartBase = new SphereGeometry(1, ...flowerConfig.heartSegments)
  const stalkBase = new CylinderGeometry(
    flowerConfig.stalkRadiusTop,
    flowerConfig.stalkRadiusBottom,
    1,
    flowerConfig.stalkSegments,
  )

  stalkBase.translate(0, 0.5, 0)

  const position = new Vector3()
  const scale = new Vector3()
  const quaternion = new Quaternion()
  const euler = new Euler(0, 0, 0, 'YXZ')
  const matrix = new Matrix4()
  const parts: BufferGeometry[] = []

  function addPiece(
    source: BufferGeometry,
    color: string,
    at: [number, number, number],
    spin: [number, number],
    size: [number, number, number],
  ) {
    euler.set(spin[0], spin[1], 0)
    matrix.compose(position.set(...at), quaternion.setFromEuler(euler), scale.set(...size))
    parts.push(paintGeometry(source.clone().applyMatrix4(matrix), color))
  }

  function addPetalRing(petalRing: PetalRing) {
    for (let index = 0; index < petalRing.count; index += 1) {
      const angle = petalRing.offset + (index / petalRing.count) * Math.PI * 2

      addPiece(
        petalBase,
        colors.petal,
        [Math.cos(angle) * petalRing.radius, petalRing.height, Math.sin(angle) * petalRing.radius],
        [petalRing.tilt, Math.PI / 2 - angle],
        petalRing.size,
      )
    }
  }

  function addBlades(height: number, length: number) {
    for (const [index, spin] of [0, Math.PI].entries()) {
      addPiece(
        petalBase,
        colors.stem,
        [
          Math.cos(spin) * flowerConfig.bladeOffset,
          height,
          Math.sin(spin) * flowerConfig.bladeOffset,
        ],
        [flowerConfig.bladeTilt, Math.PI / 2 - spin],
        [
          flowerConfig.bladeWidth,
          length * (index ? flowerConfig.bladeShrink : 1),
          flowerConfig.bladeDepth,
        ],
      )
    }
  }

  addPiece(
    stalkBase,
    colors.stem,
    [0, -flowerConfig.stalkRoot, 0],
    [0, 0],
    [1, shape.stalkScale + flowerConfig.stalkRoot, 1],
  )
  addBlades(shape.blades.height, shape.blades.length)

  for (const petalRing of shape.petalRings) {
    addPetalRing(petalRing)
  }

  addPiece(
    heartBase,
    shape.heart.usesPetalColor ? colors.petal : colors.heart,
    shape.heart.position,
    [0, 0],
    shape.heart.scale,
  )

  if (shape.outerLeaves) {
    for (const spin of shape.outerLeaves.spins) {
      addPiece(
        petalBase,
        colors.stem,
        [
          Math.cos(spin) * shape.outerLeaves.radius,
          shape.outerLeaves.height,
          Math.sin(spin) * shape.outerLeaves.radius,
        ],
        [shape.outerLeaves.tilt, Math.PI / 2 - spin],
        shape.outerLeaves.size,
      )
    }
  }

  const merged = mergeGeometries(parts)

  for (const part of parts) {
    part.dispose()
  }

  petalBase.dispose()
  heartBase.dispose()
  stalkBase.dispose()

  if (!merged) {
    throw new Error(`Could not build the ${kind} geometry.`)
  }

  return merged
}
