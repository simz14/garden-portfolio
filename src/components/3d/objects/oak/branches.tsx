import { useMemo } from 'react'
import { CylinderGeometry } from 'three'
import { paletteConfig } from '../../../../config/garden'
import { oakBranchConfig, oakConfig } from '../../../../config/oak'
import { useResources } from '../../../../context/resources'

function createBranchGeometry() {
  const geometry = new CylinderGeometry(
    oakBranchConfig.radiusTop,
    oakBranchConfig.radiusBottom,
    oakBranchConfig.length,
    oakBranchConfig.segments,
  )

  geometry.translate(0, oakBranchConfig.length / 2, 0)

  return geometry
}

export function Branches() {
  const { getMatteMaterial } = useResources()
  const geometry = useMemo(createBranchGeometry, [])

  return (
    <>
      {oakBranchConfig.angles.map((angle, index) => {
        const tilt = oakBranchConfig.baseTilt + (index % 2) * oakBranchConfig.tiltStep

        return (
          <mesh
            key={angle}
            geometry={geometry}
            material={getMatteMaterial(paletteConfig.bark)}
            position={[
              Math.cos(angle) * oakBranchConfig.trunkOffset,
              oakConfig.trunkHeight -
                oakBranchConfig.topMargin -
                (index % 3) * oakBranchConfig.dropStep,
              Math.sin(angle) * oakBranchConfig.trunkOffset,
            ]}
            rotation={[Math.sin(angle) * tilt, 0, -Math.cos(angle) * tilt]}
            scale={oakBranchConfig.baseScale + (index % 3) * oakBranchConfig.scaleStep}
            castShadow
          />
        )
      })}
    </>
  )
}
