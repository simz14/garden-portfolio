import { useEffect, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { Box3, ExtrudeGeometry, Vector3 } from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { svgIconConfig } from '../config/logos'

export function useExtrudedSvg(src: string, size: number, depth: number) {
  const svg = useLoader(SVGLoader, src)

  const geometry = useMemo(() => {
    const shapes = svg.paths.flatMap((shapePath) => shapePath.toShapes())
    const extruded = new ExtrudeGeometry(shapes, {
      depth: depth * svgIconConfig.sourceSize,
      bevelEnabled: true,
      bevelThickness: svgIconConfig.bevelSize,
      bevelSize: svgIconConfig.bevelSize,
      bevelSegments: 1,
    })

    // icons come on a 24-unit canvas with y down, so they are scaled and flipped
    const scale = size / svgIconConfig.sourceSize

    extruded.scale(scale, -scale, scale)
    extruded.computeBoundingBox()

    const centre = (extruded.boundingBox ?? new Box3()).getCenter(new Vector3())

    extruded.translate(-centre.x, -centre.y, -centre.z)
    extruded.computeVertexNormals()

    return extruded
  }, [svg, size, depth])

  useEffect(() => {
    return function disposeGeometry() {
      geometry.dispose()
    }
  }, [geometry])

  return geometry
}
