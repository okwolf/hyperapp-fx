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

/**
 * Describes an effect that will call an action at a maximum rate. Where `rate` is one call per `rate` milliseconds.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {number} props.rate - minimum time between action calls
 * @param {*} props.action - action to throttle
 * @example
 * import { Throttle } from "hyperapp-fx"
 */
export function Throttle(props) {
  return [throttleEffect, props]
}
