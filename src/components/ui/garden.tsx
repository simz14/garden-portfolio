import { Canvas } from '@react-three/fiber'
import { WebGPURenderer } from 'three/webgpu'
import { Physics } from '@react-three/rapier'
import { physicsConfig } from '../../config/scene'
import { useDebugState } from '../../hooks/debug'
import { Scene } from '../3d/scene'

export function Garden() {
  const debug = useDebugState()

  return (
    <section className="relative h-svh w-full overflow-hidden">
      <Canvas
        shadows="percentage"
        camera={{ position: [4, 4, 6] }}
        gl={async (props) => {
          // node materials need three's node renderer; it picks webgpu when
          // the browser has it and quietly falls back to webgl 2 when not
          const renderer = new WebGPURenderer({
            ...props,
            // r3f types the canvas as possibly offscreen, the web renderer
            // only ever hands over the real one
            canvas: props.canvas as HTMLCanvasElement,
          })

          await renderer.init()

          return renderer
        }}
      >
        <Physics
          gravity={physicsConfig.gravity}
          timeStep={physicsConfig.timeStep}
          debug={debug.isPhysicsVisible}
        >
          <Scene />
        </Physics>
      </Canvas>
    </section>
  )
}
