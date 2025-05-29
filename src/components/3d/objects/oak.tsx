import { oakConfig } from '../../../config/oak'
import { getWorldOffset } from '../../../utils/garden'
import { Trunk } from './oak/trunk'

export function Oak() {
  return (
    <group position={[getWorldOffset(oakConfig.x), 0, getWorldOffset(oakConfig.y)]}>
      <Trunk />
    </group>
  )
}
