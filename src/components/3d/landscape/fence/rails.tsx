import { gardenConfig, paletteConfig } from '../../../../config/garden'
import { fenceConfig } from '../../../../config/terrain'
import { getRailEdge } from '../../../../utils/fence'

export function Rails() {
  const edge = getRailEdge()

  return (
    <>
      {fenceConfig.railHeights.map((height) => (
        <group key={height}>
          <mesh position={[0, height, edge]} castShadow receiveShadow>
            <boxGeometry
              args={[gardenConfig.gridSize, fenceConfig.railThickness, fenceConfig.railDepth]}
            />
            <meshLambertNodeMaterial color={paletteConfig.rail} />
          </mesh>

          <mesh position={[edge, height, 0]} castShadow receiveShadow>
            <boxGeometry
              args={[fenceConfig.railDepth, fenceConfig.railThickness, gardenConfig.gridSize]}
            />
            <meshLambertNodeMaterial color={paletteConfig.rail} />
          </mesh>
        </group>
      ))}
    </>
  )
}
