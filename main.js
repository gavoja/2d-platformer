import { drawMap } from './map.js'

function main () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  drawMap(ctx)
}

main()
