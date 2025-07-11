import { Vector3 } from 'three'
import { bedConfig } from '../config/beds'
import { HotspotId } from '../config/hotspots'
import { mailboxConfig } from '../config/mailbox'
import { shedConfig } from '../config/shed'
import { wateringCanConfig } from '../config/watering-can'
import { getWorldOffset } from './garden'
import { getBenchSeat } from './oak'

export interface TaskSpot {
  stand: Vector3
  facing: number
}

function getFacingTowards(stand: Vector3, target: Vector3) {
  return Math.atan2(target.x - stand.x, target.z - stand.z)
}

function getMailboxSpot(): TaskSpot {
  const target = new Vector3(getWorldOffset(mailboxConfig.x), 0, getWorldOffset(mailboxConfig.y))
  const stand = new Vector3(
    target.x + mailboxConfig.standOffset[0],
    0,
    target.z + mailboxConfig.standOffset[1],
  )

  return { stand, facing: getFacingTowards(stand, target) }
}

function getShedSpot(): TaskSpot {
  const halfWidth = shedConfig.width / 2
  const halfDepth = shedConfig.depth / 2
  const target = new Vector3(
    getWorldOffset(shedConfig.x + halfWidth),
    0,
    getWorldOffset(shedConfig.y + halfDepth),
  )
  const stand = new Vector3(
    target.x + halfWidth - shedConfig.standInset,
    0,
    target.z + halfDepth + shedConfig.standDistance,
  )

  return { stand, facing: getFacingTowards(stand, target) }
}

function getWateringCanSpot(): TaskSpot {
  const target = new Vector3(...wateringCanConfig.rest).setY(0)
  const stand = new Vector3(
    target.x + wateringCanConfig.standOffset[0],
    0,
    target.z + wateringCanConfig.standOffset[1],
  )

  return { stand, facing: getFacingTowards(stand, target) }
}

function getBenchSpot(): TaskSpot {
  const seat = getBenchSeat()

  return { stand: seat.stand, facing: seat.facing }
}

export const taskSpotConfig: Record<HotspotId, TaskSpot> = {
  [HotspotId.About]: getBenchSpot(),
  [HotspotId.Contact]: getMailboxSpot(),
  [HotspotId.Tech]: getShedSpot(),
  [HotspotId.Projects]: getWateringCanSpot(),
}

export const wateringSpots = bedConfig.beds.map((bed) => {
  const isTopRow = bed.y < bedConfig.rowSplit

  return {
    stand: new Vector3(
      getWorldOffset(bed.x) + bedConfig.size / 2,
      0,
      isTopRow
        ? getWorldOffset(bed.y) + bedConfig.size + bedConfig.wateringOffset
        : getWorldOffset(bed.y) - bedConfig.wateringOffset,
    ),
    facing: isTopRow ? Math.PI : 0,
  }
})
