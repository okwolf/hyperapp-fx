import { assign } from "../utils.js"

function timeEffect(sub, dispatch) {
  var afterTimeout
  var everyInterval
  function dispatchTime() {
    dispatch(sub.action, sub.asDate ? new Date() : performance.now())
  }
  if (sub.now) {
    dispatchTime()
  }
  if (sub.after) {
    afterTimeout = setTimeout(dispatchTime, sub.after)
  }
  if (sub.every) {
    everyInterval = setInterval(dispatchTime, sub.every)
  }
  return function() {
    afterTimeout && clearTimeout(afterTimeout)
    everyInterval && clearInterval(everyInterval)
  }
}

export function Time(props) {
  return assign(props, {
    effect: timeEffect
  })
}
