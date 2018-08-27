import { assign } from "../utils.js"

var throttleLocks = []
function throttleEffect(props, dispatch) {
  var lock = throttleLocks.find(function(nextLock) {
    return nextLock[0] === props.action
  })
  if (!lock) {
    lock = [props.action]
    throttleLocks.push(lock)
  }

  if (!lock[1]) {
    dispatch(props.action)
    lock[1] = true
    setTimeout(function() {
      lock[1] = false
    }, props.rate)
  }
}

export function Throttle(props) {
  return assign({ effect: throttleEffect }, props)
}
