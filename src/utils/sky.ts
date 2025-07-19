import { Color, LinearSRGBColorSpace, MathUtils } from 'three'
import type { SkyState } from '../hooks/sky'

const sampleCount = 12

function fitRrtAndOdt(value: number) {
  const numerator = value * (value + 0.0245786) - 0.000090537
  const denominator = value * (0.983729 * value + 0.432951) + 0.238081

  return numerator / denominator
}

function toneMap(color: Color) {
  const r = color.r / 0.6
  const g = color.g / 0.6
  const b = color.b / 0.6

  const fitted = [
    fitRrtAndOdt(0.59719 * r + 0.35458 * g + 0.04823 * b),
    fitRrtAndOdt(0.07600 * r + 0.90834 * g + 0.01566 * b),
    fitRrtAndOdt(0.02840 * r + 0.13383 * g + 0.83777 * b),
  ]

  return [
    1.60475 * fitted[0] - 0.53108 * fitted[1] - 0.07367 * fitted[2],
    -0.10208 * fitted[0] + 1.10813 * fitted[1] - 0.00605 * fitted[2],
    -0.00327 * fitted[0] - 0.07276 * fitted[1] + 1.07602 * fitted[2],
  ].map((channel) => MathUtils.clamp(channel, 0, 1))
}

const horizon = new Color()
const haze = new Color()
const mid = new Color()
const top = new Color()

const sampled = new Color()
const mapped = new Color()

function sampleSky(sky: SkyState, height: number) {
  const { hazeStop, midStop } = sky

  horizon.set(sky.horizonColor)
  haze.set(sky.hazeColor)
  mid.set(sky.midColor)
  top.set(sky.topColor)

  sampled.copy(horizon).lerp(haze, MathUtils.clamp(height / hazeStop, 0, 1))
  sampled.lerp(mid, MathUtils.clamp((height - hazeStop) / (midStop - hazeStop), 0, 1))
  sampled.lerp(top, MathUtils.clamp((height - midStop) / (1 - midStop), 0, 1))

  const [r, g, b] = toneMap(sampled)

  mapped.setRGB(r, g, b, LinearSRGBColorSpace)

  return mapped.getStyle()
}

export function createSkyGradient(sky: SkyState) {
  const stops = Array.from({ length: sampleCount }, (_, index) => {
    const height = index / (sampleCount - 1)

    return `${sampleSky(sky, height)} ${(height * 100).toFixed(1)}%`
  })

  return `linear-gradient(to top, ${stops.join(', ')})`
}
