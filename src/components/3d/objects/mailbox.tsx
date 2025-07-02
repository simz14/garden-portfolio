import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { obstacleConfig, paletteConfig } from '../../../config/garden'
import { mailboxConfig } from '../../../config/mailbox'
import { useResources } from '../../../context/resources'
import { useZone } from '../../../hooks/zone'
import { getWorldOffset } from '../../../utils/garden'
import { Box } from './mailbox/box'
import { Envelopes } from './mailbox/envelopes'
import { Grass } from './mailbox/grass'
import { HotspotId } from '../../../config/hotspots'

const halfWall = obstacleConfig.wallHeight / 2

export function Mailbox() {
  const { box, getMatteMaterial } = useResources()
  const zone = useZone(HotspotId.Contact)

  return (
    <group
      {...zone}
      position={[getWorldOffset(mailboxConfig.x), 0, getWorldOffset(mailboxConfig.y)]}
    >
      <mesh
        material={getMatteMaterial(paletteConfig.bark)}
        position-y={mailboxConfig.post.height / 2}
        castShadow
      >
        <cylinderGeometry
          args={[
            mailboxConfig.post.radiusTop,
            mailboxConfig.post.radiusBottom,
            mailboxConfig.post.height,
            mailboxConfig.post.segments,
          ]}
        />
      </mesh>

      <mesh
        geometry={box}
        material={getMatteMaterial(mailboxConfig.platform.color)}
        position={mailboxConfig.platform.position}
        scale={mailboxConfig.platform.size}
        castShadow
        receiveShadow
      />

      <Box />
      <Envelopes />
      <Grass />

      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider
          args={[halfWall, mailboxConfig.postRadius]}
          position={[0, halfWall, 0]}
        />
      </RigidBody>
    </group>
  )
}
