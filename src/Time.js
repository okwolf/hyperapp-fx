function timeEffect(props, dispatch) {
  var afterTimeout
  var everyInterval
  function dispatchTime() {
    dispatch(props.action, props.asDate ? new Date() : performance.now())
  }
  if (props.now) {
    dispatchTime()
  }
  if (props.after) {
    afterTimeout = setTimeout(dispatchTime, props.after)
  }
  if (props.every) {
    everyInterval = setInterval(dispatchTime, props.every)
  }
  return function() {
    afterTimeout && clearTimeout(afterTimeout)
    everyInterval && clearInterval(everyInterval)
  }
}

export function Time(props) {
  return {
    props: props,
    effect: timeEffect
  }
}
