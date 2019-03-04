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

/**
 * Describes an effect that can provide timestamps to actions using [`performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) or dates using the [`new Date()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Syntax) API. The action can be fired now, after a delay, or at a regular interval. The timestamp/date will be provided as the action `data`.
 *
 * @memberof module:subs
 * @param {object} props
 * @param {boolean} props.now - get the current time immediately
 * @param {number} props.after - get the time after a delay
 * @param {number} props.every - get the time repeatedly after waiting a set interval
 * @param {boolean} props.asDate - use a Date object instead of a timestamp
 * @param {*} props.action - action to call with the time
 * @example
 * import { Time } from "hyperapp-fx"
 */
export function Time(props) {
  return [timeEffect, props]
}
