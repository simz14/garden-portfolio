import {
  Fn,
  cos,
  max,
  modelWorldMatrix,
  positionGeometry,
  positionLocal,
  sin,
  vec3,
  vec4,
} from 'three/tsl'
import type { NodeMaterial } from 'three/webgpu'
import type { UniformNode } from 'three/webgpu'

export type WindUniform = UniformNode<'float', number>

export function applyWindSway(
  material: NodeMaterial,
  strength: number,
  wind: WindUniform,
) {
  material.positionNode = Fn(() => {
    // three folds the instance matrix into positionLocal before it builds
    // positionNode, so this is already the blade placed in the mesh
    const placed = positionLocal.toConst()

    // world position drives the phase, so neighbouring blades lean together
    // instead of every instance swaying on the same beat
    const windAt = modelWorldMatrix.mul(vec4(placed, 1)).xyz.toConst()

    // only the part of the blade above its root bends, the base stays planted
    const bend = max(positionGeometry.y, 0).mul(strength)

    const swayX = sin(wind.add(windAt.x.mul(0.55)).add(windAt.z.mul(0.35))).mul(bend)
    const swayZ = cos(wind.mul(0.8).add(windAt.z.mul(0.45))).mul(bend).mul(0.6)

    return placed.add(vec3(swayX, 0, swayZ))
  })()

  material.needsUpdate = true
}
