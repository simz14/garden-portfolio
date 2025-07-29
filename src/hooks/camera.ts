import { useEffect } from 'react'
import { Fog, OrthographicCamera, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControlsImpl } from '@react-three/drei'
import type { CameraControls } from '@react-three/drei'
import { createFocusTimeline, createIntroTimeline } from '../animations/camera'
import { cameraConfig, cameraFollowConfig, cameraViewConfig } from '../config/scene'
import { useCameraView } from './camera-view'
import { getFittedZoom } from '../utils/camera'
import { getSmoothingFactor } from '../utils/motion'
import { useIsReducedMotion } from './device'
import { Tumble, setGarden, useGarden } from './garden'
import { getGardenerPosition } from './gardener-position'

let isCameraDragging = false
let focusTween: gsap.core.Tween | null = null

export function setIsCameraDragging(isDragging: boolean) {
  isCameraDragging = isDragging
}

export function getIsCameraDragging() {
  return isCameraDragging
}

export function useCameraControls() {
  return useThree((state) => state.controls) as CameraControls | null
}

export function useSceneFog() {
  const scene = useThree((state) => state.scene)

  return scene.fog instanceof Fog ? scene.fog : null
}

export function useCameraHome() {
  const controls = useCameraControls()

  useEffect(() => {
    if (!controls) {
      return
    }

    controls.mouseButtons.wheel = CameraControlsImpl.ACTION.NONE
    controls.mouseButtons.middle = CameraControlsImpl.ACTION.NONE
    controls.mouseButtons.right = CameraControlsImpl.ACTION.NONE
    controls.touches.two = CameraControlsImpl.ACTION.NONE
    controls.touches.three = CameraControlsImpl.ACTION.NONE

    const [x, y, z] = cameraConfig.target

    controls.setTarget(x, y, z, false)
  }, [controls])
}

export function useCameraViewPreset() {
  const controls = useCameraControls()
  const view = useCameraView()

  useEffect(() => {
    if (!controls) {
      return
    }

    const preset = cameraViewConfig[view]

    controls.minPolarAngle = preset.topPolarAngle
    controls.maxPolarAngle = preset.polarAngle
    controls.minAzimuthAngle = preset.azimuth - preset.azimuthRange
    controls.maxAzimuthAngle = preset.azimuth + preset.azimuthRange

    controls.rotateTo(preset.azimuth, preset.polarAngle, true)
  }, [controls, view])
}

export function useCameraMoves() {
  const controls = useCameraControls()
  const fog = useSceneFog()
  const size = useThree((state) => state.size)
  const isReducedMotion = useIsReducedMotion()
  const hasEntered = useGarden((state) => state.hasEntered)
  const isReady = useGarden((state) => state.isReady)
  const selected = useGarden((state) => state.selected)

  useEffect(() => {
    const canPlayIntro = controls !== null && fog !== null && hasEntered

    if (!canPlayIntro) {
      return
    }

    const tween = createIntroTimeline(controls, fog, size, isReducedMotion, () => {
      setGarden({ isReady: true })
    })

    return function killIntro() {
      tween.kill()
    }
  }, [controls, fog, hasEntered])

  useEffect(() => {
    const canFocus = controls !== null && fog !== null && isReady

    if (!canFocus) {
      return
    }

    const tween = createFocusTimeline(controls, fog, size, selected)

    focusTween = tween

    return function killFocus() {
      tween.kill()

      if (focusTween === tween) {
        focusTween = null
      }
    }
  }, [controls, fog, isReady, selected])
  useEffect(() => {
    const shouldRefit = controls !== null && isReady && selected === null

    if (!shouldRefit) {
      return
    }

    controls.zoomTo(getFittedZoom(size.width, size.height), false)
  }, [controls, isReady, selected, size])
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

export function useCameraFollow() {
  const controls = useCameraControls()
  const size = useThree((state) => state.size)
  const isReady = useGarden((state) => state.isReady)
  const selected = useGarden((state) => state.selected)
  const tumble = useGarden((state) => state.tumble)

  useFrame(({ camera }, rawDelta) => {
    const isFocusing = focusTween !== null && focusTween.isActive()
    const canFollow =
      controls !== null && isReady && selected === null && !isFocusing &&
      tumble !== Tumble.Falling && camera instanceof OrthographicCamera

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
