import { extend } from '@react-three/fiber'
import type { ThreeElement } from '@react-three/fiber'
import {
  LineBasicNodeMaterial,
  MeshBasicNodeMaterial,
  MeshLambertNodeMaterial,
} from 'three/webgpu'

// node materials ship in three's webgpu namespace, which r3f does not know
// about, so the ones the garden uses are registered as jsx elements by hand
extend({ LineBasicNodeMaterial, MeshBasicNodeMaterial, MeshLambertNodeMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    lineBasicNodeMaterial: ThreeElement<typeof LineBasicNodeMaterial>
    meshBasicNodeMaterial: ThreeElement<typeof MeshBasicNodeMaterial>
    meshLambertNodeMaterial: ThreeElement<typeof MeshLambertNodeMaterial>
  }
}
