import type { KeyboardControlsEntry } from '@react-three/drei'

export enum GardenControl {
  Forward = 'forward',
  Backward = 'backward',
  Left = 'left',
  Right = 'right',
  Select = 'select',
  Dismiss = 'dismiss',
}

export const keyboardMap: KeyboardControlsEntry<GardenControl>[] = [
  { name: GardenControl.Forward, keys: ['ArrowUp', 'KeyW'] },
  { name: GardenControl.Backward, keys: ['ArrowDown', 'KeyS'] },
  { name: GardenControl.Left, keys: ['ArrowLeft', 'KeyA'] },
  { name: GardenControl.Right, keys: ['ArrowRight', 'KeyD'] },
  { name: GardenControl.Select, keys: ['Enter'] },
  { name: GardenControl.Dismiss, keys: ['Escape'] },
]

export const thumbstickConfig = {
  padSize: 56,
  knobTravel: 30,
  deadzone: 0.14,
}
