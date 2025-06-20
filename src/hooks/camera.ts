import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Fog } from 'three'
import type { CameraControls } from '@react-three/drei'
import { cameraConfig } from '../config/scene'
import { getFittedZoom, getHomePosition } from '../utils/camera'

export function useSceneFog() {
  const scene = useThree((state) => state.scene)

  return scene.fog instanceof Fog ? scene.fog : null
}

export function useCameraControls() {
  return useThree((state) => state.controls) as CameraControls | null
}

// drop the camera on its isometric perch once, everything after that is a move
// away from home rather than a fresh placement
export function useCameraHome() {
  const controls = useCameraControls()
  const size = useThree((state) => state.size)

  useEffect(() => {
    if (!controls) {
      return
    }

    const [x, y, z] = getHomePosition()
    const [targetX, targetY, targetZ] = cameraConfig.target

    controls.setLookAt(x, y, z, targetX, targetY, targetZ, false)
    controls.zoomTo(getFittedZoom(size.width, size.height), false)
  }, [controls, size])
}
