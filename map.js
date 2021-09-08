import { TILE_SIZE, TILE_COLOR } from './constants.js'

const map = `
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,##,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,##,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,################,,
,,,,,,,,,,,,,,,,,,,,
`

export function drawMap (ctx) {
  ctx.fillStyle = TILE_COLOR

  let y = 0
  for (const line of map.trim().split('\n')) {
    let x = 0
    for (const char of line) {
      if (char === '#') {
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
      }
      x += TILE_SIZE
    }

    y += TILE_SIZE
  }
  console.log('Hello!')
}
