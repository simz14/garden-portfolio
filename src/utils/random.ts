const multiplier = 1664525
const increment = 1013904223
const modulus = 4294967296

export function createRandom(seed: number) {
  let state = seed

  return function getNextRandom() {
    state = (state * multiplier + increment) % modulus

    return state / modulus
  }
}
