import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { WebGPURenderer } from 'three/webgpu'
import { KeyboardControls, PerformanceMonitor, Preload, Stats } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { GardenControl, keyboardMap } from '../../config/controls'
import { physicsConfig, rendererConfig } from '../../config/scene'
import { getGarden, resetGarden, selectHotspot, setGarden, useGarden } from '../../hooks/garden'
import { useHotspotRegistry } from '../../hooks/hotspots'
import { useDebugState } from '../../hooks/debug'
import { QualityLevel, setQualityLevel } from '../../hooks/quality'
import { ResourcesProvider } from '../../context/resources'
import { useIsTouch } from '../../hooks/device'
import { useIsSectionActive } from '../../hooks/visibility'
import { useSky } from '../../hooks/sky'
import { BackButton } from './back-button'
import { Intro } from './intro'
import { ProjectsPanel } from './projects-panel'
import { TechDrawer } from './tech-drawer'
import { Thumbstick } from './thumbstick'
import { createSkyGradient } from '../../utils/sky'
import { Scene } from '../3d/scene'

export function Garden() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isActive = useIsSectionActive(sectionRef)
  const { getNearbyHotspot } = useHotspotRegistry()
  const isTouch = useIsTouch()
  const debug = useDebugState()
  const sky = useSky()
  // the sky is the section's own background rather than anything in the scene:
  // the canvas is transparent, so the ramp always covers the screen whatever the
  // camera does, and it is already painted before webgl draws its first frame
  const skyGradient = useMemo(() => createSkyGradient(sky), [sky])
  const isReady = useGarden((state) => state.isReady)
  const selected = useGarden((state) => state.selected)

  const [pixelRatio, setPixelRatio] = useState(rendererConfig.highPixelRatio)

  useEffect(() => resetGarden, [])

  function handleControl(name: string, isPressed: boolean) {
    if (!isPressed) {
      return
    }

    if (name === GardenControl.Dismiss) {
      selectHotspot(null)

      return
    }

    if (!getGarden().isReady) {
      return
    }

    if (name === GardenControl.Select) {
      const nearby = getNearbyHotspot()

      if (nearby) {
        selectHotspot(nearby)
      }

      return
    }

    setGarden({ isGreeting: false })

    if (getGarden().selected) {
      selectHotspot(null)
    }
  }

  return (
    <KeyboardControls map={keyboardMap} onChange={handleControl}>
      <section
        className="relative h-svh min-h-140 w-full overflow-hidden"
        style={{ background: skyGradient }}
      >
        <div ref={sectionRef} className="absolute inset-0">
          <Canvas
            shadows="percentage"
            dpr={pixelRatio}
            gl={async (props) => {
              // node materials need three's node renderer; it picks webgpu when
              // the browser has it and quietly falls back to webgl 2 when not
              const renderer = new WebGPURenderer({
                ...props,
                // r3f types the canvas as possibly offscreen, the web renderer
                // only ever hands over the real one
                canvas: props.canvas as HTMLCanvasElement,
                powerPreference: 'high-performance',
              })

              await renderer.init()

              return renderer
            }}
            frameloop={isActive ? 'always' : 'never'}
            onPointerMissed={(event) => {
              if (event.target instanceof HTMLCanvasElement) {
                selectHotspot(null)
              }
            }}
          >
            <PerformanceMonitor
              onIncline={() => {
                setPixelRatio(rendererConfig.highPixelRatio)
                setQualityLevel(QualityLevel.High)
              }}
              onDecline={() => {
                setPixelRatio(rendererConfig.lowPixelRatio)
                setQualityLevel(QualityLevel.Low)
              }}
            />

            <ResourcesProvider>
              <Physics
                gravity={physicsConfig.gravity}
                timeStep={physicsConfig.timeStep}
                debug={debug.isPhysicsVisible}
              >
                <Scene />
              </Physics>
              <Preload all />
              {debug.isFpsVisible && <Stats />}
            </ResourcesProvider>
          </Canvas>
        </div>

        <Intro />
        <BackButton />
        {isTouch && <Thumbstick isHidden={!isReady || selected !== null} />}
        <ProjectsPanel />
        <TechDrawer />
      </section>
    </KeyboardControls>
  )
}
