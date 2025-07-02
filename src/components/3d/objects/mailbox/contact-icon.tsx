import { Html, useCursor } from '@react-three/drei'
import { useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { envelopeConfig } from '../../../../config/mailbox'
import type { ContactLink } from '../../../../data/contact'
import { useGarden } from '../../../../hooks/garden'
import { useResources } from '../../../../context/resources'
import { useExtrudedSvg } from '../../../../hooks/svg-geometry'

export function ContactIcon({ link }: { link: ContactLink }) {
  const isDelivered = useGarden((state) => state.isDelivered)
  const { getMatteMaterial } = useResources()
  const geometry = useExtrudedSvg(link.src, envelopeConfig.iconSize, envelopeConfig.iconDepth)

  const [isHovered, setIsHovered] = useState(false)

  useCursor(isHovered && isDelivered)

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()

    if (!isDelivered) {
      return
    }

    window.open(link.href, link.href.startsWith('mailto:') ? '_self' : '_blank', 'noreferrer')
  }

  return (
    <>
      <mesh
        geometry={geometry}
        material={getMatteMaterial(link.color)}
        position={[0, envelopeConfig.iconDrop, envelopeConfig.iconLift]}
        visible={isDelivered}
        onClick={handleClick}
        onPointerOver={(event) => {
          event.stopPropagation()
          setIsHovered(true)
        }}
        onPointerOut={() => setIsHovered(false)}
        castShadow
      />

      {/* the mesh carries the click, this keeps a real link for keyboard and screen readers */}
      <Html pointerEvents="none" style={{ pointerEvents: 'none' }}>
        <a href={link.href} rel="noreferrer" className="sr-only">
          {link.label}
        </a>
      </Html>
    </>
  )
}
