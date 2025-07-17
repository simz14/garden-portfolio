import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { WebGPURenderer } from 'three/webgpu'
import { KeyboardControls, PerformanceMonitor } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { keyboardMap } from '../../config/controls'
import { physicsConfig, rendererConfig } from '../../config/scene'
import { QualityLevel, setQualityLevel } from '../../hooks/quality'
import { ResourcesProvider } from '../../context/resources'
import { Scene } from '../3d/scene'

export function Garden() {
  const [pixelRatio, setPixelRatio] = useState(rendererConfig.highPixelRatio)

  return (
    <KeyboardControls map={keyboardMap}>
      <section className="relative h-svh w-full overflow-hidden">
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
          </ResourcesProvider>
        </Canvas>
      </section>
    </KeyboardControls>
  )
}
