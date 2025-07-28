import { useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { WebGPURenderer } from 'three/webgpu'
import { KeyboardControls, PerformanceMonitor, Preload, Stats } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { keyboardMap } from '../../config/controls'
import { physicsConfig, rendererConfig } from '../../config/scene'
import { QualityLevel, setQualityLevel } from '../../hooks/quality'
import { ResourcesProvider } from '../../context/resources'
import { useIsSectionActive } from '../../hooks/visibility'
import { useSky } from '../../hooks/sky'
import { createSkyGradient } from '../../utils/sky'
import { BackButton } from './back-button'
import { ProjectsPanel } from './projects-panel'
import { Scene } from '../3d/scene'

export function Garden() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isActive = useIsSectionActive(sectionRef)
  const sky = useSky()
  // the sky is the section's own background rather than anything in the scene:
  // the canvas is transparent, so the ramp always covers the screen whatever the
  // camera does, and it is already painted before webgl draws its first frame
  const skyGradient = useMemo(() => createSkyGradient(sky), [sky])
  const [pixelRatio, setPixelRatio] = useState(rendererConfig.highPixelRatio)

  return (
    <KeyboardControls map={keyboardMap}>
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
                debug={physicsConfig.isDebugVisible}
              >
                <Scene />
              </Physics>
              <Preload all />
              {debug.isFpsVisible && <Stats />}
            </ResourcesProvider>
          </Canvas>
        </div>

        <BackButton />
        <ProjectsPanel />
      </section>
    </KeyboardControls>
  )
}
