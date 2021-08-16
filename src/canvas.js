import utils from './utils'
import './style.scss'
import 'font-awesome/css/font-awesome.css'


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ['#00bdff', '#4d39ce', '#088eff']

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

let mouseDown = false
addEventListener('mousedown', () => {
  mouseDown = true
})

addEventListener('mouseup', () => {
  mouseDown = false
}) 

// Objects
class Particle {
  constructor(x, y, radius, color) {
    this.originalX = x
    this.originalY = y
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.radians = Math.random() * Math.PI * 2
    this.velocity = 0.05
    this.distanceFromCenter = utils.randomIntFromRange(20, 80)
    this.lastMouse = {x: x, y: y}
    this.increaseDistance = 0
  }

  draw(lastPoint) {
    c.beginPath()
    c.strokeStyle = this.color
    c.lineWidth = this.radius
    c.moveTo(lastPoint.x, lastPoint.y)
    c.lineTo(this.x, this.y)
    c.stroke()
    c.closePath()
  }

  update() {
    const lastPoint = {x: this.x, y: this.y}
    // Move points over time
    this.radians += this.velocity;
    // Drag effect
    this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05
    this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05
    // Circular motion
    this.x = this.lastMouse.x + Math.cos(this.radians) * (this.distanceFromCenter + this.increaseDistance);
    this.y = this.lastMouse.y + Math.sin(this.radians) * (this.distanceFromCenter + this.increaseDistance);
    this.draw(lastPoint)
    // Increase the particles distance from center
    if (mouseDown) {
      this.increaseDistance += 0.8
    }
    else {
      if (this.increaseDistance > 0) {
        this.increaseDistance -= 0.8
      }
    }
  }
}

// Implementation
let particles
function init() {
  particles = []

  for (let i = 0; i < 50; i++) {
    const radius = (Math.random() * 2) + 1
    particles.push(new Particle(canvas.width / 2, canvas.height / 2, radius, utils.randomColor(colors)))
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.05)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  particles.forEach(particle => {
   particle.update()
  })
}

init()
animate()
