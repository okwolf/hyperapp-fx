import { makeDispatchTime } from "../utils.js"

function nowEffect(dispatch, props) {
  makeDispatchTime(dispatch, props)()
}

function delayEffect(dispatch, props) {
  setTimeout(makeDispatchTime(dispatch, props), props.wait)
}

/**
 * Describes an effect that provides the current timestamp (using [`performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)) or current date (using [`new Date()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Syntax)). The timestamp/date will be provided as the action `data`.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {boolean} props.asDate - use a Date object instead of a timestamp
 * @param {*} props.action - action to call with the timestamp/date
 * @example
 * import { Now } from "hyperapp-fx"
 *
 * const NowAction = state => [
 *   state,
 *   Now({
 *     asDate: true,
 *     action(currentDate) {
 *     }
 *   })
 * ]
 */
export function Now(props) {
  return [nowEffect, props]
}

/**
 * Describes an effect that provides a timestamp (using [`performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)) or date (using [`new Date()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Syntax)) after a delay. The timestamp/date will be provided as the action `data`.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {number} props.wait - delay to wait before calling action
 * @param {boolean} props.asDate - use a Date object instead of a timestamp
 * @param {*} props.action - action to call with the timestamp/date
 * @example
 * import { Delay } from "hyperapp-fx"
 *
 * const DelayedAction = state => [
 *   state,
 *   Delay({
 *     wait: 500,
 *     action() {
 *       // This action will run after a 500ms delay
 *     }
 *   })
 * ]
 */
export function Delay(props) {
  return [delayEffect, props]
}
