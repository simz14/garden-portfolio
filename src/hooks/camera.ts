import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import type { CameraControls } from '@react-three/drei'
import { cameraConfig } from '../config/scene'
import { getHomePosition } from '../utils/camera'

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
