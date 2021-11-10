const { Engine, Render, Runner, Bodies, Body, Composite } = window.Matter

const MAX_VELOCITY = 4
const JUMP_FORCE = 0.03
const GRAVITY = 4
const MOVEMENT_FORCE = 0.002

const TILE_SIZE = 24
const MAP = `
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,,,,
,,#,,,,,,,,##,,,,,,,
,,#,,,,,,,,,,,,,,,,,
,,#,,##,,@,,,,,,,,,,
,,#,,,,,,,###,,,,,,,
,,#,,,,,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,#,,
,,#,,,,,,,,,#,,,,#,,
,,################,,
,,,,,,,,,,,,,,,,,,,,
`

const walls = []
const players = []

function createWorld () {
  let y = 0
  for (const line of MAP.trim().split('\n')) {
    let x = 0
    for (const char of line) {
      if (char === '#') {
        const wall = Bodies.rectangle(x, y, TILE_SIZE, TILE_SIZE, {
          isStatic: true,
          render: {
            fillStyle: '#44a',
            strokeStyle: 0
          }
        })
        walls.push(wall)
      }

      if (char === '@') {
        const player = Bodies.rectangle(x, y, TILE_SIZE, TILE_SIZE, {
          inertia: Infinity, // Prevent rotation.
          render: {
            fillStyle: 'red',
            lineWidth: 0
          }
        })
        players.push(player)
      }

      x += TILE_SIZE
    }

    y += TILE_SIZE
  }
  console.log('Hello!')
}

const keys = { left: false, right: false }

document.addEventListener('keydown', event => {
  keys.right = event.key === 'd'
  keys.left = event.key === 'a'
  keys.up = event.key === 'w'
  // console.log(player.velocity)
})

document.addEventListener('keyup', event => {
  if (keys.right && event.key === 'd') {
    keys.right = false
  }

  if (keys.left && event.key === 'a') {
    keys.left = false
  }

  if (keys.up && event.key === 'w') {
    keys.up = false
  }
})

// create an engine
const engine = Engine.create({
  gravity: { x: 0, y: GRAVITY }
})

// create a renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false
  }
})

createWorld()

// add all of the bodies to the world
Composite.add(engine.world, [...walls, ...players])

// run the renderer
Render.run(render)

// create runner
// const runner = Runner.create({ isFixed: true })
// run the engine
// Runner.run(runner, engine)

const DELTA = 1000 / 60

function update () {
  const player = players[0]

  if (keys.right && !keys.left) {
    player.friction = 0
    Body.applyForce(player, player.position, { x: MOVEMENT_FORCE, y: 0 })
  }

  if (keys.left && !keys.right) {
    player.friction = 0
    Body.applyForce(player, player.position, { x: -MOVEMENT_FORCE, y: 0 })
  }

  if (keys.up && Math.abs(player.velocity.y) < 0.0000001) {
    Body.applyForce(player, player.position, { x: 0, y: -JUMP_FORCE })
  }

  console.log(player.velocity.y)

  // Speed limit.
  const velx = Math.abs(player.velocity.x)
  if (velx > MAX_VELOCITY) {
    Body.setVelocity(player, { x: player.velocity.x / velx * MAX_VELOCITY, y: player.velocity.y })
  }

  console.log(player.velocity)

  if (!keys.left && !keys.right) {
    player.friction = 0.8
  }

  Engine.update(engine, DELTA)
}

// TODO: Make it better.
function animate () {
  update()

  setTimeout(function () {
    requestAnimationFrame(animate)
  }, DELTA)
}

animate()
