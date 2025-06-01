import { useEffect, useMemo } from 'react'
import { BoxGeometry, EdgesGeometry } from 'three'
import { paletteConfig } from '../../../../config/garden'
import { shedConfig } from '../../../../config/shed'
import { useResources } from '../../../../context/resources'

const halfWidth = shedConfig.width / 2
const halfDepth = shedConfig.depth / 2
const centreHeight = shedConfig.floorHeight + shedConfig.height / 2

function createDividers() {
  return Array.from({ length: shedConfig.dividerCount }, (_, index) => {
    const x = -halfWidth + (shedConfig.width * (index + 1)) / (shedConfig.dividerCount + 1)

    return { key: index, x }
  })
}

export function Walls() {
  const { glassMaterial, getMatteMaterial } = useResources()

  const glassGeometry = useMemo(
    () => new BoxGeometry(shedConfig.width, shedConfig.height, shedConfig.depth),
    [],
  )
  const edgeGeometry = useMemo(() => new EdgesGeometry(glassGeometry), [glassGeometry])
  const dividers = useMemo(createDividers, [])

  useEffect(() => {
    return function disposeGeometry() {
      glassGeometry.dispose()
      edgeGeometry.dispose()
    }
  }, [glassGeometry, edgeGeometry])

  return (
    <>
      <mesh geometry={glassGeometry} material={glassMaterial} position-y={centreHeight} />

      <lineSegments geometry={edgeGeometry} position-y={centreHeight}>
        <lineBasicNodeMaterial color={paletteConfig.frame} />
      </lineSegments>

      {dividers.map((divider) =>
        [-halfDepth, halfDepth].map((z) => (
          <mesh
            key={`${divider.key}-${z}`}
            material={getMatteMaterial(paletteConfig.frame)}
            position={[divider.x, centreHeight, z]}
          >
            <boxGeometry
              args={[shedConfig.dividerWidth, shedConfig.height, shedConfig.dividerWidth]}
            />
          </mesh>
        )),
      )}
    </>
  )
}
