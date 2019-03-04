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

/**
 * Describes an effect that will call an action from inside a [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) loop, which is also where the render triggered by the action will run. A relative timestamp will be provided as the action `data`.
 *
 * @memberof module:subs
 * @param {*} action - action to call inside a requestAnimationFrame loop
 * @example
 * import { Animation } from "hyperapp-fx"
 */
export function Animation(action) {
  return [animationEffect, action]
}
