import { useEffect } from 'react'
import { Fog } from 'three'
import { useThree } from '@react-three/fiber'
import type { CameraControls } from '@react-three/drei'
import { cameraConfig } from '../config/scene'
import { getHomePosition } from '../utils/camera'

export function useSceneFog() {
  const scene = useThree((state) => state.scene)

  return scene.fog instanceof Fog ? scene.fog : null
}

// drop the camera on its isometric perch once, everything after that is a move
// away from home rather than a fresh placement
export function useCameraHome() {
  const controls = useThree((state) => state.controls) as CameraControls | null

  useEffect(() => {
    if (!controls) {
      return
    }

    const [x, y, z] = getHomePosition()
    const [targetX, targetY, targetZ] = cameraConfig.target

    controls.setLookAt(x, y, z, targetX, targetY, targetZ, false)
  }, [controls])
}
