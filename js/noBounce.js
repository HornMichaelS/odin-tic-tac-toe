document.body.addEventListener('touchmove', (event) => {
  event.preventDefault()
}, {
  passive: false,
  useCapture: false
})

window.onresize(() => {
  document.body.style.width = window.innerWidth
  document.body.style.height = window.innerHeight
})

document.onload(() => {
  window.onresize()
})
