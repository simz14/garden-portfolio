import { useFrame } from '@react-three/fiber'
import { resourceConfig } from '../config/resources'
import { useIsReducedMotion } from './device'
import { useResources } from '../context/resources'

export function useWind() {
  const { wind } = useResources()
  const isReducedMotion = useIsReducedMotion()

  useFrame(({ clock }) => {
    if (isReducedMotion) {
      return
    }

    wind.value = clock.elapsedTime * resourceConfig.windSpeed
  })
}
