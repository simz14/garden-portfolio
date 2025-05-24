import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'
import { paletteConfig } from '../../../../config/garden'
import { fenceConfig } from '../../../../config/terrain'
import { getPostEdge, getPostOffsets } from '../../../../utils/fence'

function createPosts() {
  const edge = getPostEdge()
  const height = fenceConfig.postHeight / 2

  return getPostOffsets().map((along, index) => {
    return [
      { key: `along-${index}`, position: [along, height, edge] as [number, number, number] },
      { key: `down-${index}`, position: [edge, height, along] as [number, number, number] },
    ]
  }).flat()
}

export function Posts() {
  const posts = useMemo(createPosts, [])

  return (
    <Instances
      frustumCulled={false}
      limit={posts.length}
      range={posts.length}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[fenceConfig.postWidth, fenceConfig.postHeight, fenceConfig.postWidth]} />
      <meshLambertNodeMaterial color={paletteConfig.fence} />

      {posts.map((post) => (
        <Instance key={post.key} position={post.position} />
      ))}
    </Instances>
  )
}
