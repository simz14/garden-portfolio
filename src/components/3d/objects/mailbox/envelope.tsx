import { Suspense, useLayoutEffect, useRef } from 'react'
import { Color, Matrix4 } from 'three'
import type { InstancedMesh } from 'three'
import type { ContactLink } from '../../../../data/contact'
import { envelopeConfig } from '../../../../config/mailbox'
import { useResources } from '../../../../context/resources'
import type { EnvelopePaper } from '../../../../utils/envelope'
import { ContactIcon } from './contact-icon'

const halfHeight = envelopeConfig.height / 2
const stampX = envelopeConfig.width * envelopeConfig.stamp.offset[0]
const stampY = envelopeConfig.height * envelopeConfig.stamp.offset[1]

export function Envelope({ paper, link }: { paper: EnvelopePaper, link: ContactLink }) {
  const { getMatteMaterial } = useResources()
  const dashRef = useRef<InstancedMesh>(null)

  const brandMaterial = getMatteMaterial(link.color)
  const flapMaterial = getMatteMaterial(envelopeConfig.flapColor)
  const foldY = halfHeight - paper.flapDrop

  useLayoutEffect(() => {
    const mesh = dashRef.current

    if (!mesh) {
      return
    }

    const matrix = new Matrix4()
    const color = new Color()

    paper.spots.forEach((spot, index) => {
      matrix.makeRotationZ(spot.rotation)
      matrix.setPosition(spot.x, spot.y, 0.017)
      mesh.setMatrixAt(index, matrix)
      mesh.setColorAt(index, color.set(index % 2 ? link.color : envelopeConfig.flapColor))
    })

    mesh.instanceMatrix.needsUpdate = true

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true
    }
  }, [paper, link])

  return (
    <>
      <mesh geometry={paper.card} material={getMatteMaterial(envelopeConfig.paperColor)} castShadow />
      <mesh geometry={paper.flap} material={flapMaterial} position-z={0.016} />

      {[-1, 1].map((side) => (
        <mesh
          key={side}
          geometry={paper.fold}
          material={brandMaterial}
          position={[(side * envelopeConfig.width) / 4, halfHeight - paper.flapDrop / 2, 0.019]}
          rotation-z={side * paper.foldAngle}
        />
      ))}

      <mesh geometry={paper.seal} material={brandMaterial} position={[0, foldY, 0.021]} />
      <mesh
        geometry={paper.sealCore}
        material={getMatteMaterial(envelopeConfig.sealCoreColor)}
        position={[0, foldY, 0.023]}
      />

      <mesh
        geometry={paper.stamp}
        material={getMatteMaterial('#ffffff')}
        position={[stampX, stampY, 0.017]}
      />
      <mesh geometry={paper.stampInk} material={brandMaterial} position={[stampX, stampY, 0.021]} />
      <mesh geometry={paper.stampMotif} material={flapMaterial} position={[stampX, stampY, 0.026]} />

      <instancedMesh ref={dashRef} args={[paper.dash, undefined, paper.spots.length]}>
        <meshLambertNodeMaterial />
      </instancedMesh>

      <Suspense fallback={null}>
        <ContactIcon link={link} />
      </Suspense>
    </>
  )
}
