import { BoxGeometry, CircleGeometry, Shape, ShapeGeometry } from 'three'
import { envelopeConfig } from '../config/mailbox'

const halfWidth = envelopeConfig.width / 2
const halfHeight = envelopeConfig.height / 2
const flapDrop = envelopeConfig.height * envelopeConfig.flapDropRatio

function createDashSpots() {
  const spots: { x: number, y: number, rotation: number }[] = []
  const insetWidth = halfWidth - envelopeConfig.dash.inset
  const insetHeight = halfHeight - envelopeConfig.dash.inset
  const across = Math.floor((insetWidth * 2) / envelopeConfig.dash.pitch)
  const down = Math.floor((insetHeight * 2 - envelopeConfig.dash.pitch) / envelopeConfig.dash.pitch)

  for (let index = 0; index < across; index += 1) {
    const x = -insetWidth + ((index + 0.5) / across) * insetWidth * 2

    spots.push({ x, y: insetHeight, rotation: 0 }, { x, y: -insetHeight, rotation: 0 })
  }

  for (let index = 0; index < down; index += 1) {
    const y = -insetHeight + ((index + 0.5) / down) * insetHeight * 2

    spots.push(
      { x: insetWidth, y, rotation: Math.PI / 2 },
      { x: -insetWidth, y, rotation: Math.PI / 2 },
    )
  }

  return spots
}

export function createEnvelopePaper() {
  const flapShape = new Shape()

  flapShape.moveTo(-halfWidth, halfHeight)
  flapShape.lineTo(halfWidth, halfHeight)
  flapShape.lineTo(0, halfHeight - flapDrop)
  flapShape.closePath()

  return {
    flapDrop,
    card: new BoxGeometry(envelopeConfig.width, envelopeConfig.height, envelopeConfig.thickness),
    flap: new ShapeGeometry(flapShape),
    fold: new BoxGeometry(Math.hypot(halfWidth, flapDrop), envelopeConfig.foldThickness, 0.005),
    foldAngle: Math.atan2(flapDrop, halfWidth),
    seal: new CircleGeometry(envelopeConfig.sealRadius, 14),
    sealCore: new CircleGeometry(envelopeConfig.sealCoreRadius, 10),
    stamp: new BoxGeometry(...envelopeConfig.stamp.size),
    stampInk: new BoxGeometry(...envelopeConfig.stamp.inkSize),
    stampMotif: new CircleGeometry(envelopeConfig.stamp.motifRadius, 10),
    dash: new BoxGeometry(envelopeConfig.dash.length, envelopeConfig.dash.thickness, 0.005),
    spots: createDashSpots(),
  }
}

export type EnvelopePaper = ReturnType<typeof createEnvelopePaper>

export function disposeEnvelopePaper(paper: EnvelopePaper) {
  paper.card.dispose()
  paper.flap.dispose()
  paper.fold.dispose()
  paper.seal.dispose()
  paper.sealCore.dispose()
  paper.stamp.dispose()
  paper.stampInk.dispose()
  paper.stampMotif.dispose()
  paper.dash.dispose()
}
