document.addEventListener("DOMContentLoaded", () => {
  initCanvas()
  initBlocksPositions()

  addBlockEventListener('block01', 1)
  addBlockEventListener('block02-canvas', 2)
})

initBlocksPositions = () => {
  const block01cx =  window.innerWidth / 2
  const block01cy =  window.innerHeight / 2

  let block01 = document.getElementById('block01')
  block01.style.left = (block01cx - 100) + 'px'
  block01.style.top = (block01cy - 100) + 'px'

  const block02cx = 400
  const block02cy = 400

  let block02 = document.getElementById('block02-canvas')
  block02.style.left = (block02cx - 200) + "px"
  block02.style.top = (block02cy - 200) + "px"

  let line = document.getElementById('line')
  line.x1.baseVal.value = block01cx
  line.y1.baseVal.value = block01cy
  line.x2.baseVal.value = block02cx
  line.y2.baseVal.value = block02cy
}

let draggingInsideCanvas = false

initCanvas = () => {
  const stage = new Konva.Stage({
    container: 'block02-canvas',
    width: 400,
    height: 400
  })

  const layer = new Konva.Layer()

  const triangle = new Konva.RegularPolygon({
    x: 200,
    y: 170,
    rotation: 180,
    sides: 3,
    radius: 140,
    fill: '#05386B',
    stroke: '#5CDB95',
    strokeWidth: 10,
    draggable: true,
  })

  triangle.on('mouseover', () => {
    triangle.radius(160)
    layer.draw()
    draggingInsideCanvas = true
  })

  triangle.on('mouseout', () => {
    triangle.radius(140)
    layer.draw()
    draggingInsideCanvas = false
  })

  layer.add(triangle)
  stage.add(layer)
  console.log(stage)
}

getLinePoint = (linePointId) => {
  let line = document.getElementById('line')
  if (linePointId == 1) {
    return {
      x: line.x1.baseVal.value,
      y: line.y1.baseVal.value
    }
  } else {
    return {
      x: line.x2.baseVal.value,
      y: line.y2.baseVal.value
    }
  }
}

setLinePoint = (linePointId, x, y) => {
  let line = document.getElementById('line')
  if (linePointId == 1) {
    line.x1.baseVal.value = x
    line.y1.baseVal.value = y
  } else {
    line.x2.baseVal.value = x
    line.y2.baseVal.value = y
  }
}

addBlockEventListener = (id, linePointId) => {
  const block = document.getElementById(id)
  let blockIsMoving = false
  let offsetX = 0
  let offsetY = 0
  let linePointOffsetX = 0
  let linePointOffsetY = 0

  block.addEventListener('mousedown', (e) => {
    if (draggingInsideCanvas) {
      return
    }

    blockIsMoving = true
    const left = Number.parseInt(block.style.left)
    const top = Number.parseInt(block.style.top)

    offsetX = e.clientX - left
    offsetY = e.clientY - top

    const linePoint = getLinePoint(linePointId)
    
    linePointOffsetX = linePoint.x - left
    linePointOffsetY = linePoint.y - top

    document.querySelectorAll(".moving-block").forEach((el) => {
      el.style.zIndex = -10
    })

    block.style.zIndex = -9
  })

  block.addEventListener('mouseup', (e) => {
    blockIsMoving = false
  })

  window.addEventListener('mousemove', (e) => {
    if (blockIsMoving) {
      const left = e.clientX - offsetX
      const top = e.clientY - offsetY

      block.style.left = left + 'px'
      block.style.top = top + 'px'

      setLinePoint(linePointId, left + linePointOffsetX, top + linePointOffsetY)
    }
  })
}