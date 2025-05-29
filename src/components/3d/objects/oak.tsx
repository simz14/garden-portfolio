import { oakConfig } from '../../../config/oak'
import { getWorldOffset } from '../../../utils/garden'
import { Branches } from './oak/branches'
import { Trunk } from './oak/trunk'

export function Oak() {
  return (
    <group position={[getWorldOffset(oakConfig.x), 0, getWorldOffset(oakConfig.y)]}>
      <Trunk />
      <Branches />
    </group>
  )
}
