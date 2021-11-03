const { Engine, Render, Runner, Bodies, Composite } = window.Matter

const TILE_SIZE = 24
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
          render: {
            fillStyle: 'red',
            lineWidth: 0
          }
        })
        players.push(player)
        // TODO: Implement player.
      }

      x += TILE_SIZE
    }

    y += TILE_SIZE
  }
  console.log('Hello!')
}

// create an engine
const engine = Engine.create()

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

// create two boxes and a ground
// const boxA = Bodies.rectangle(400, 200, 80, 80)
// const boxB = Bodies.rectangle(450, 50, 80, 80)
// const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
createWorld()

// add all of the bodies to the world
Composite.add(engine.world, [...walls, ...players])

// run the renderer
Render.run(render)

// create runner
const runner = Runner.create()

// run the engine
Runner.run(runner, engine)
