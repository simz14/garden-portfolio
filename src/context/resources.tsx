import { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { BoxGeometry, SphereGeometry } from 'three'
import { MeshLambertNodeMaterial } from 'three/webgpu'
import { uniform } from 'three/tsl'
import { seedConfig } from '../config/random'
import { resourceConfig } from '../config/resources'
import { createLumpyBall } from '../utils/geometry'
import { createRandom } from '../utils/random'
import { applyWindSway } from '../shaders/wind-sway'
import { createGroundTexture } from '../utils/textures'

// one pool of geometries, materials and textures shared by the whole scene,
// so hundreds of meshes reuse a handful of gpu objects instead of one each
interface Disposable {
  dispose: () => void
}

export type Resources = ReturnType<typeof createResources>

function createResources() {
  const bin: Disposable[] = []

  // ledger of everything that needs a manual dispose, three frees nothing itself
  function track<T extends Disposable>(item: T) {
    bin.push(item)

    return item
  }

  const materialsByColor = new Map<string, MeshLambertNodeMaterial>()

  // cache by colour, so every mesh painted the same bark shares one material
  function getMatteMaterial(color: string) {
    const existing = materialsByColor.get(color)

    if (existing) {
      return existing
    }

    const material = track(new MeshLambertNodeMaterial({ color }))

    materialsByColor.set(color, material)

    return material
  }

  // one shared uniform, so a single number sways every blade and flower at once
  const wind = uniform(0)
  const bladeMaterial = track(new MeshLambertNodeMaterial({ color: resourceConfig.bladeColor }))

  applyWindSway(bladeMaterial, resourceConfig.bladeWindStrength, wind)

  const ground = createGroundTexture(createRandom(seedConfig.ground))

  if (ground) {
    track(ground)
  }

  return {
    getMatteMaterial,
    wind,
    bladeMaterial,
    ground,
    box: track(new BoxGeometry(1, 1, 1)),
    ball: track(new SphereGeometry(1, ...resourceConfig.ballSegments)),
    canopies: resourceConfig.canopies.map((canopy) =>
      track(createLumpyBall(canopy.detail, canopy.amount, canopy.frequency)),
    ),
    dispose() {
      for (const item of bin) {
        item.dispose()
      }
    },
  }
}

const ResourcesContext = createContext<Resources | null>(null)

// context rather than a module singleton, so the pool dies with the canvas and
// a remount cannot hand out already disposed gpu handles
export function ResourcesProvider({ children }: { children: ReactNode }) {
  const resources = useMemo(createResources, [])

  useEffect(() => {
    return function disposeResources() {
      resources.dispose()
    }
  }, [resources])

  return <ResourcesContext value={resources}>{children}</ResourcesContext>
}

export function useResources() {
  const resources = useContext(ResourcesContext)

  if (!resources) {
    throw new Error('The garden resources are out of reach.')
  }

  return resources
}
