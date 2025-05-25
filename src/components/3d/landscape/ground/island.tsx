import { useEffect, useMemo } from 'react'
import { seedConfig } from '../../../../config/random'
import { createIslandUnderside } from '../../../../utils/island'
import { createRandom } from '../../../../utils/random'

export function Island() {
  const geometry = useMemo(() => createIslandUnderside(createRandom(seedConfig.island)), [])

  useEffect(() => {
    return function disposeIsland() {
      geometry.dispose()
    }
  }, [geometry])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshLambertNodeMaterial vertexColors flatShading />
    </mesh>
  )
}
