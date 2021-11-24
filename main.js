// const { Engine, Render, Runner, Bodies, Body, Composite } = window.Matter

const planck = window.planck

// const MAX_VELOCITY = 4
// const JUMP_FORCE = 0.03
// const GRAVITY = 4
// const MOVEMENT_FORCE = 0.002

// const TILE_SIZE = 24
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
,,#,,,,,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,,,,
,,#,,,,,,,,#######,,
,,#,,,,,,,,,,,,,,,,,
,,#####,,,,,,,,,,,,,
,,#,,,,,,,,,,,,,,#,,
,,#,,,,,,,,,#,,,,#,,
,,################,,
,,,,,,,,,,,,,,,,,,,,
`

const walls = []
let player
let playerFixture = null
let playerSensor = null
let isInAir = false

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

function createWall (world, x, y) {
  const body = world.createBody({
    position: planck.Vec2(x, y)
  })

  const fixture = planck.Box(1.0, 1.0)
  body.createFixture(fixture, 0.0)
  walls.push(body)
}

function createPlayer (world, x, y) {
  const body = world.createDynamicBody({
    position: planck.Vec2(x, y),
    allowSleep: false
  })

  const fixture = planck.Box(1.0, 1.0)
  body.createFixture(fixture, 0.0)
  player = body
  playerFixture = fixture

  playerSensor = body.createFixture({
    shape: planck.Box(0.8, 0.5, planck.Vec2(0, -0.7)),
    isSensor: true
  })
}

planck.testbed(testbed => {
  testbed.x = 49
  testbed.y = 49
  testbed.width = 100
  testbed.height = 100

  const world = new planck.World({
    gravity: planck.Vec2(0, -50)
  })

  let y = 0
  for (const line of MAP.trim().split('\n')) {
    let x = 0
    for (const char of line) {
      if (char === '#') {
        createWall(world, x, -y)
      }

      if (char === '@') {
        createPlayer(world, x, -y)
      }

      x += 2
    }

    y += 2
  }

  world.on('begin-contact', contact => {
    const fixtureA = contact.getFixtureA()
    const fixtureB = contact.getFixtureB()

    if (fixtureA === playerSensor || fixtureB === playerSensor) {
      isInAir = false
    }
  })

  world.on('end-contact', contact => {
    const fixtureA = contact.getFixtureA()
    const fixtureB = contact.getFixtureB()

    if (fixtureA === playerSensor || fixtureB === playerSensor) {
      isInAir = true
    }
  })

  testbed.step = () => {
    // Go left.
    if (testbed.activeKeys.left && !testbed.activeKeys.right) {
      const f = player.getWorldVector(planck.Vec2(-1.0, 0))
      const p = player.getWorldPoint(planck.Vec2(0.0, 0.0))

      const vel = player.getLinearVelocity()

      if (vel.x > -15) {
        player.applyLinearImpulse(f, p, true)
      }
    }

    // Go right.
    if (testbed.activeKeys.right && !testbed.activeKeys.left) {
      const f = player.getWorldVector(planck.Vec2(1.0, 0))
      const p = player.getWorldPoint(planck.Vec2(0.0, 0.0))

      const vel = player.getLinearVelocity()

      if (vel.x < 15) {
        player.applyLinearImpulse(f, p, true)
      }
    }

    if (!isInAir && !testbed.activeKeys.right && !testbed.activeKeys.left) {
      const vel = player.getLinearVelocity()
      if (vel.x > 0) {
        const f = player.getWorldVector(planck.Vec2(-1.0, 0))
        const p = player.getWorldPoint(planck.Vec2(0.0, 0.0))
        player.applyLinearImpulse(f, p, true)
      }

      if (vel.x < 0) {
        const f = player.getWorldVector(planck.Vec2(1.0, 0))
        const p = player.getWorldPoint(planck.Vec2(0.0, 0.0))
        player.applyLinearImpulse(f, p, true)
      }
    }

    // Jump.
    if (!isInAir && testbed.activeKeys.up) {
      const f = player.getWorldVector(planck.Vec2(0, 10.0))
      const p = player.getWorldPoint(planck.Vec2(0.0, 0.0))

      player.applyLinearImpulse(f, p, true)
    }
  }

  return world
})
