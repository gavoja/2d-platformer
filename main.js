const TILE_SIZE = 24
const WALL_COLOR = '#000'
const PLAYER_COLOR = '#282'
const GRAVITY = 0.3
const FRICTION = 0.7
const VELOCITY = 3

const MAP = `
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,##,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,##,,@,,,,,,,,,,
,,,,,,,,,,###,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,#,,
,,#,,,,,,,,,#,,,,#,,
,,################,,
,,,,,,,,,,,,,,,,,,,,
`

class Entity {
  constructor (x, y, width, height, color) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.vx = 0
    this.vy = 0
  }

  get left () {
    return this.x
  }

  get right () {
    return this.x + this.width
  }

  get top () {
    return this.y
  }

  get bottom () {
    return this.y + this.height
  }

  set left (value) {
    this.x = value
  }

  set right (value) {
    this.x = value - this.width
  }

  set top (value) {
    this.y = value
  }

  set bottom (value) {
    this.y = value - this.height
  }
}

const world = {
  walls: [],
  player: null
}

const keys = {
  left: false,
  right: false,
  jump: false
}

function loadWorld () {
  let y = 0
  for (const line of MAP.trim().split('\n')) {
    let x = 0
    for (const char of line) {
      if (char === '#') {
        world.walls.push(new Entity(x, y, TILE_SIZE, TILE_SIZE, WALL_COLOR))
      }

      if (char === '@') {
        world.player = new Entity(x, y, TILE_SIZE, TILE_SIZE, PLAYER_COLOR)
      }
      x += TILE_SIZE
    }

    y += TILE_SIZE
  }
  console.log('Hello!')
}

function drawWorld () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const wall of world.walls) {
    ctx.fillStyle = wall.color
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height)
  }

  ctx.fillStyle = world.player.color
  ctx.fillRect(world.player.x, world.player.y, world.player.width, world.player.height)
}

function handleKeys () {
  window.addEventListener('keydown', event => {
    if (event.key === 'a') {
      keys.left = true
    }

    if (event.key === 'd') {
      keys.right = true
    }

    if (event.key === 'w') {
      keys.jump = true
    }
  })

  window.addEventListener('keyup', event => {
    if (event.key === 'a') {
      keys.left = false
    }

    if (event.key === 'd') {
      keys.right = false
    }

    if (event.key === 'w') {
      keys.jump = false
    }
  })
}

function main () {
  handleKeys()
  loadWorld()
  loop()
}

let isOnTheGround = false

function getNearestWall () {
  let length = Number.MAX_SAFE_INTEGER
  let nearestWall = null
  for (const wall of world.walls) {
    const currentLength = Math.sqrt((world.player.x - wall.x) ** 2 + (world.player.y - wall.y) ** 2)
    if (currentLength < length) {
      length = currentLength
      nearestWall = wall
    }
  }

  return nearestWall
}

function isColiding (ent1, ent2) {
  return ent1.x < ent2.right &&
    ent1.right > ent2.x &&
    ent1.y < ent2.bottom &&
    ent1.bottom > ent2.y
}

function loop () {
  drawWorld()

  if (keys.left === keys.right) {
    world.player.vx *= FRICTION
  } else {
    if (keys.left) {
      world.player.vx = -VELOCITY
    }

    if (keys.right) {
      world.player.vx = VELOCITY
    }
  }

  if (isOnTheGround && keys.jump) {
    world.player.vy = -2 * VELOCITY
    isOnTheGround = false
  }

  if (!isOnTheGround) {
    world.player.vy += GRAVITY
  } else {
    world.player.vy = 0
  }

  world.player.x += world.player.vx
  world.player.y += world.player.vy

  // isOnTheGround = false

  // Step 1: get the nearest wall.
  const wall = getNearestWall()

  for (const wall of world.walls) {
    wall.color = WALL_COLOR
  }
  // Step 2: check if player collides with the nearest wall.

  // Step 3: correct player position.

  if (isColiding(world.player, wall)) {
    wall.color = '#f88'
    if (world.player.bottom > wall.top && world.player.bottom < wall.bottom) {
      world.player.bottom = wall.top
      isOnTheGround = true
    } else {
      isOnTheGround = false
    }

    // if (world.player.top < wall.bottom && world.player.top > wall.top) {
    //   world.player.top = wall.bottom
    // }

    // if (world.player.right > wall.left && world.player.right < wall.right) {
    //   world.player.right = wall.left
    // }
  }

  window.requestAnimationFrame(loop)
}

main()
