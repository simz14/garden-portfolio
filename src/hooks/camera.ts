import { useEffect } from 'react'
import { OrthographicCamera, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Fog } from 'three'
import type { CameraControls } from '@react-three/drei'
import { cameraConfig, cameraFollowConfig } from '../config/scene'
import { getFittedZoom, getHomePosition } from '../utils/camera'
import { getSmoothingFactor } from '../utils/motion'
import { getGardenerPosition } from './gardener-position'

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

const followTarget = new Vector3()
const followAim = new Vector3()
const followOffset = new Vector3()
const cameraRight = new Vector3()
const cameraUp = new Vector3()
const groundRight = new Vector3()
const groundUp = new Vector3()

function getExcess(screen: number, limit: number) {
  return Math.sign(screen) * Math.max(0, Math.abs(screen) - limit)
}

// the camera only budges once she leaves a generous middle box, so small steps
// never drag the whole garden around under her feet
export function useCameraFollow() {
  const controls = useCameraControls()
  const size = useThree((state) => state.size)

  useFrame(({ camera }, rawDelta) => {
    const canFollow = controls !== null && camera instanceof OrthographicCamera

    if (!canFollow) {
      return
    }

    const halfWidth = size.width / (2 * camera.zoom)
    const halfHeight = size.height / (2 * camera.zoom)

    if (halfWidth * 2 >= cameraConfig.fitWidth) {
      return
    }

    controls.getTarget(followTarget)
    followOffset.copy(getGardenerPosition()).setY(followTarget.y).sub(followTarget)

    cameraRight.setFromMatrixColumn(camera.matrixWorld, 0)
    cameraUp.setFromMatrixColumn(camera.matrixWorld, 1)

    const excessX = getExcess(followOffset.dot(cameraRight), halfWidth * cameraFollowConfig.deadzone)
    const excessY = getExcess(followOffset.dot(cameraUp), halfHeight * cameraFollowConfig.deadzone)

    if (excessX === 0 && excessY === 0) {
      return
    }

    groundRight.copy(cameraRight).setY(0).normalize()
    groundUp.copy(cameraUp).setY(0).normalize()

    const gainX = groundRight.dot(cameraRight)
    const gainY = groundUp.dot(cameraUp)

    followAim.copy(followTarget)

    if (gainX > cameraFollowConfig.minAxisGain) {
      followAim.addScaledVector(groundRight, excessX / gainX)
    }

    if (gainY > cameraFollowConfig.minAxisGain) {
      followAim.addScaledVector(groundUp, excessY / gainY)
    }

    const delta = Math.min(rawDelta, 0.1)

    followTarget.lerp(followAim, getSmoothingFactor(cameraFollowConfig.rate, delta))
    controls.setTarget(followTarget.x, followTarget.y, followTarget.z, false)
  })
}
