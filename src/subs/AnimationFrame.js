function frameEffect(action, dispatch) {
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

export function AnimationFrame(action) {
  return {
    props: action,
    effect: frameEffect
  }
}
