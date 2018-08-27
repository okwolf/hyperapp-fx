function animationEffect(sub, dispatch) {
  var cancelId

  function frame(timestamp) {
    dispatch(sub.action, timestamp)
    cancelId = requestAnimationFrame(frame)
  }

  cancelId = requestAnimationFrame(frame)
  return function() {
    cancelAnimationFrame(cancelId)
  }
}

export function Animation(action) {
  return {
    action: action,
    effect: animationEffect
  }
}
