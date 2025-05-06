import { Canvas } from '@react-three/fiber'
import { WebGPURenderer } from 'three/webgpu'

export function Garden() {
  return (
    <section className="relative h-svh w-full overflow-hidden">
      <Canvas
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
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshNormalMaterial />
        </mesh>
      </Canvas>
    </section>
  )
}
