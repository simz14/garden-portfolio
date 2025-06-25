import { getWorldOffset } from '../utils/garden'
import { mailboxConfig } from './mailbox'
import { oakConfig } from './oak'
import { shedConfig } from './shed'

export enum HotspotId {
  Projects = 'projects',
  About = 'about',
  Tech = 'tech',
  Contact = 'contact',
}

interface HotspotProfile {
  labelAnchor: [number, number, number]
  ring: [number, number, number]
  ringScale: number
  reach: number
  focusAim: [number, number, number]
  focusZoom: number
}

const ringHeight = 0.03
const shedCentreX = shedConfig.x + shedConfig.width / 2
const shedCentreY = shedConfig.y + shedConfig.depth / 2

export const hotspotIds = Object.values(HotspotId)

export const hotspotConfig: Record<HotspotId, HotspotProfile> = {
  [HotspotId.Projects]: {
    labelAnchor: [getWorldOffset(8.5), 1.9, getWorldOffset(14.4)],
    ring: [getWorldOffset(8.5), ringHeight, getWorldOffset(14.4)],
    ringScale: 6,
    reach: 6.5,
    focusAim: [getWorldOffset(11.2), -0.5, getWorldOffset(14.4)],
    focusZoom: 1.55,
  },
  [HotspotId.About]: {
    labelAnchor: [getWorldOffset(oakConfig.x), 5.2, getWorldOffset(oakConfig.y)],
    ring: [getWorldOffset(oakConfig.x), ringHeight, getWorldOffset(oakConfig.y)],
    ringScale: 2.8,
    reach: 4,
    focusAim: [getWorldOffset(oakConfig.x) + 2.2, 0.5, getWorldOffset(oakConfig.y) - 2.2],
    focusZoom: 1.9,
  },
  [HotspotId.Tech]: {
    labelAnchor: [getWorldOffset(18.3), 3.6, getWorldOffset(4)],
    ring: [getWorldOffset(shedCentreX), ringHeight, getWorldOffset(shedCentreY)],
    ringScale: 2.6,
    reach: 4.2,
    focusAim: [getWorldOffset(shedCentreX), -0.6, getWorldOffset(shedCentreY)],
    focusZoom: 2.2,
  },
  [HotspotId.Contact]: {
    labelAnchor: [getWorldOffset(mailboxConfig.x), 2.6, getWorldOffset(mailboxConfig.y)],
    ring: [getWorldOffset(mailboxConfig.x), ringHeight, getWorldOffset(mailboxConfig.y)],
    ringScale: 1.2,
    reach: 3,
    focusAim: [getWorldOffset(mailboxConfig.x), 0.3, getWorldOffset(mailboxConfig.y)],
    focusZoom: 3,
  },
}

export const hoverConfig = {
  lift: 0.3,
  seconds: 0.28,
  ringOpacity: 0.5,
  innerRadius: 0.55,
  outerRadius: 1,
  segments: 40,
}
