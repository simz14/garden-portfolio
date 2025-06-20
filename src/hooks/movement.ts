const thumbstick = { x: 0, y: 0 }

function setThumbstick(x: number, y: number) {
  thumbstick.x = x
  thumbstick.y = y
}

function getThumbstick() {
  return thumbstick
}

export function useThumbstick() {
  return { setThumbstick, getThumbstick }
}
