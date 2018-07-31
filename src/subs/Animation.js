function animationEffect(action, dispatch) {
  var cancelId

  function frame(timestamp) {
    dispatch(action, timestamp)
    cancelId = requestAnimationFrame(frame)
  }

  cancelId = requestAnimationFrame(frame)
  return function() {
    cancelAnimationFrame(cancelId)
  }
}

export function Animation(action) {
  return {
    props: action,
    effect: animationEffect
  }
}
