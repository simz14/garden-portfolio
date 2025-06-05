import { logoFlowerConfig } from '../../../../../config/logos'
import { logoSources } from '../../../../../data/logos'
import type { LogoKind } from '../../../../../data/logos'
import { useResources } from '../../../../../context/resources'
import { useExtrudedSvg } from '../../../../../hooks/svg-geometry'

export function LogoHead({ kind }: { kind: LogoKind }) {
  const logo = logoSources[kind]
  const { getMatteMaterial } = useResources()
  const geometry = useExtrudedSvg(logo.src, logoFlowerConfig.headSize, logoFlowerConfig.headDepth)

  return <mesh geometry={geometry} material={getMatteMaterial(logo.color)} castShadow />
}
