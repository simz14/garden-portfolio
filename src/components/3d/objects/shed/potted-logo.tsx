import { Suspense } from 'react'
import { paletteConfig } from '../../../../config/garden'
import { logoFlowerConfig } from '../../../../config/logos'
import type { LogoKind } from '../../../../data/logos'
import { cameraConfig } from '../../../../config/scene'
import { shedPotConfig } from '../../../../config/shed'
import { useResources } from '../../../../context/resources'
import { LogoHead } from './potted-logo/logo-head'
import { Stem } from './potted-logo/stem'

export function PottedLogo({
  at,
  kind,
  size = 1,
}: {
  at: [number, number, number]
  kind: LogoKind
  size?: number
}) {
  const { getMatteMaterial } = useResources()
  const [x, y, z] = at

  return (
    <>
      <mesh
        material={getMatteMaterial(paletteConfig.pot)}
        position={[x, y + 0.085 * size, z]}
        scale={size}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            shedPotConfig.radiusTop,
            shedPotConfig.radiusBottom,
            shedPotConfig.height,
            shedPotConfig.segments,
          ]}
        />
      </mesh>

      <group position={[x, y + 0.16 * size, z]} rotation-y={cameraConfig.azimuth} scale={size}>
        <Stem />

        <group position-y={logoFlowerConfig.headHeight}>
          <Suspense fallback={null}>
            <LogoHead kind={kind} />
          </Suspense>
        </group>
      </group>
    </>
  )
}
