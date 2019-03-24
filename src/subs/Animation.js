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
 * Describes an effect that will call an action from inside a [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) loop, which is also where the render triggered by the action will run.
 * A relative timestamp will be provided as the action `data`.
 *
 * @memberof module:subs
 * @param {*} action - action to call inside a requestAnimationFrame loop
 * @example
 * import { h, app } from "hyperapp"
 * import { Animation, BatchFx, Merge } from "hyperapp-fx"
 *
 * const UpdateTime = time => ({ time: lastTime, delta: lastDelta }) => ({
 *   time,
 *   delta: time && lastTime ? time - lastTime : lastDelta
 * })
 *
 * const AnimationFrame = (state, time) => [
 *   state,
 *   BatchFx(
 *     Merge(UpdateTime(time)),
 *     Merge(UpdateStateForDelta),
 *     Merge(UpdateMoreStateForDelta),
 *     // ...
 *   )
 * ]
 *
 * app({
 *   init: {
 *     time: 0,
 *     delta: 0,
 *     running: true
 *   }
 *   // ...
 *   subscriptions: ({ running }) => (running ? [Animation(AnimationFrame)] : [])
 * })
 */
export function Animation(action) {
  return [animationEffect, action]
}
