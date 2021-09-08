import { TILE_SIZE, TILE_COLOR, PLAYER_COLOR } from './constants.js'

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
,,,,,,,,,@,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,################,,
,,,,,,,,,,,,,,,,,,,,
`

export function drawMap (ctx) {
  let y = 0
  for (const line of map.trim().split('\n')) {
    let x = 0
    for (const char of line) {
      if (char === '#') {
        ctx.fillStyle = TILE_COLOR
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
      }

      if (char === '@') {
        ctx.fillStyle = PLAYER_COLOR
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
      }
      x += TILE_SIZE
    }

    y += TILE_SIZE
  }
  console.log('Hello!')
}
