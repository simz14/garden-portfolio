import { useEffect, useRef } from 'react'
import { DoubleSide } from 'three'
import { MeshLambertNodeMaterial } from 'three/webgpu'
import { useMemo } from 'react'
import type { Group, Mesh } from 'three'
import { paletteConfig } from '../../../../config/garden'
import { mailboxConfig } from '../../../../config/mailbox'
import { createLetterSlideTween, createMailboxDoorTween } from '../../../../animations/mailbox'
import { useGarden } from '../../../../hooks/garden'
import { HotspotId } from '../../../../config/hotspots'
import { useResources } from '../../../../context/resources'

export function Box() {
  const { box, getMatteMaterial } = useResources()
  const isOpen = useGarden((state) => state.selected === HotspotId.Contact && state.isReached)
  const isDelivered = useGarden((state) => state.isDelivered)

  const doorRef = useRef<Group>(null)
  const letterRef = useRef<Mesh>(null)

  const shellMaterial = useMemo(
    () => new MeshLambertNodeMaterial({ color: paletteConfig.accent, side: DoubleSide }),
    [],
  )

  useEffect(() => {
    return function disposeShell() {
      shellMaterial.dispose()
    }
  }, [shellMaterial])

  useEffect(() => {
    const door = doorRef.current

    if (!door) {
      return
    }

    const tween = createMailboxDoorTween(door, isOpen)

    return function killTween() {
      tween.kill()
    }
  }, [isOpen])

  useEffect(() => {
    const letter = letterRef.current

    if (!letter) {
      return
    }

    const tween = createLetterSlideTween(letter, isDelivered)

    return function killTween() {
      tween.kill()
    }
  }, [isDelivered])

  return (
    <>
      <mesh
        material={shellMaterial}
        position-y={mailboxConfig.floorHeight}
        rotation-z={Math.PI / 2}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            mailboxConfig.radius,
            mailboxConfig.radius,
            mailboxConfig.body.height,
            mailboxConfig.body.segments,
            1,
            true,
            0,
            Math.PI,
          ]}
        />
      </mesh>

      <mesh
        material={shellMaterial}
        position={[-mailboxConfig.endOffset, mailboxConfig.floorHeight, 0]}
        rotation-y={Math.PI / 2}
        receiveShadow
      >
        <circleGeometry args={[mailboxConfig.radius, mailboxConfig.body.segments, 0, Math.PI]} />
      </mesh>

      <group ref={doorRef} position={[mailboxConfig.endOffset, mailboxConfig.floorHeight, 0]}>
        <mesh material={shellMaterial} rotation-y={Math.PI / 2} castShadow>
          <circleGeometry args={[mailboxConfig.radius, mailboxConfig.body.segments, 0, Math.PI]} />
        </mesh>
      </group>

      <mesh
        geometry={box}
        material={getMatteMaterial(paletteConfig.flag)}
        position={mailboxConfig.flag.position}
        scale={mailboxConfig.flag.size}
        castShadow
      />

      <mesh
        ref={letterRef}
        geometry={box}
        material={getMatteMaterial(mailboxConfig.letter.color)}
        position={mailboxConfig.letter.position}
        scale={mailboxConfig.letter.size}
        castShadow
        receiveShadow
      />
    </>
  )
}
