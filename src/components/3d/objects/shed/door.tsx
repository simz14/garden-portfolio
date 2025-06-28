import { useEffect, useRef } from 'react'
import type { Group } from 'three'
import { paletteConfig } from '../../../../config/garden'
import { shedConfig, shedDoorConfig } from '../../../../config/shed'
import { createDoorSlideTween } from '../../../../animations/shed'
import { useGarden } from '../../../../hooks/garden'
import { useResources } from '../../../../context/resources'
import { HotspotId } from '../../../../config/hotspots'

const halfWidth = shedConfig.width / 2
const halfDepth = shedConfig.depth / 2
const homeX = halfWidth
const doorHeight = shedConfig.height * shedDoorConfig.heightRatio
const travel = shedDoorConfig.width - shedDoorConfig.barWidth
const midHeight = shedConfig.floorHeight + doorHeight / 2

const verticalBars = [
  -shedDoorConfig.width + shedDoorConfig.barWidth / 2,
  -shedDoorConfig.barWidth / 2,
]

const horizontalBars = [
  shedConfig.floorHeight + shedDoorConfig.barWidth / 2,
  shedConfig.floorHeight + doorHeight - shedDoorConfig.barWidth / 2,
]

export function Door() {
  const { box, getMatteMaterial, glassMaterial } = useResources()
  const isOpen = useGarden((state) => state.selected === HotspotId.Tech && state.isReached)
  const doorRef = useRef<Group>(null)

  const frameMaterial = getMatteMaterial(paletteConfig.frame)

  useEffect(() => {
    const door = doorRef.current

    if (!door) {
      return
    }

    const tween = createDoorSlideTween(door, homeX, travel, isOpen)

    return function killTween() {
      tween.kill()
    }
  }, [isOpen])

  return (
    <group ref={doorRef} position={[homeX, 0, halfDepth + 0.05]}>
      <mesh
        material={glassMaterial}
        position={[-shedDoorConfig.width / 2, midHeight, 0]}
      >
        <boxGeometry args={[shedDoorConfig.width, doorHeight, shedDoorConfig.thickness]} />
      </mesh>

      {verticalBars.map((x) => (
        <mesh
          key={x}
          geometry={box}
          material={frameMaterial}
          position={[x, midHeight, 0]}
          scale={[shedDoorConfig.barWidth, doorHeight, shedDoorConfig.barWidth]}
        />
      ))}

      {horizontalBars.map((y) => (
        <mesh
          key={y}
          geometry={box}
          material={frameMaterial}
          position={[-shedDoorConfig.width / 2, y, 0]}
          scale={[shedDoorConfig.width, shedDoorConfig.barWidth, shedDoorConfig.barWidth]}
        />
      ))}

      <mesh
        geometry={box}
        material={getMatteMaterial(shedDoorConfig.handleColor)}
        position={[
          shedDoorConfig.handleOffset[0],
          shedConfig.floorHeight +
            doorHeight * shedDoorConfig.handleHeightRatio +
            shedDoorConfig.handleSize[1] / 2,
          shedDoorConfig.handleOffset[1],
        ]}
        scale={shedDoorConfig.handleSize}
      />
    </group>
  )
}
