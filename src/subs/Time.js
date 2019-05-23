import { makeDispatchTime } from "../utils"

function intervalEffect(dispatch, props) {
  var dispatchTime = makeDispatchTime(dispatch, props)
  var everyInterval = setInterval(dispatchTime, props.every)
  return function() {
    everyInterval && clearInterval(everyInterval)
  }
}

/**
 * Describes an effect that provides a timestamp (using [`performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)) or date (using [`new Date()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Syntax)) at a regular interval. The timestamp/date will be provided as the action `data`.
 *
 * @memberof module:subs
 * @param {object} props
 * @param {boolean} props.asDate - use a Date object instead of a timestamp
 * @param {number} props.every - get the time repeatedly after waiting a set interval
 * @param {*} props.action - action to call with the timestamp/date
 * @example
 * import { h, app } from "hyperapp"
 * import { Now, Interval } from "hyperapp-fx"
 *
 * const UpdateDate = (_, date) =>
 *   date.toLocaleString("uk", {
 *     hour: "numeric",
 *     minute: "numeric",
 *     second: "numeric"
 *   })
 *
 * const InitialTime = Now({
 *   asDate: true,
 *   action: UpdateDate
 * })
 *
 * const TimeSub = Interval({
 *   every: 100,
 *   asDate: true,
 *   action: UpdateDate
 * })
 *
 * app({
 *   init: ["", InitialTime],
 *   view: time => <h1>{time}</h1>,
 *   container: document.body,
 *   subscriptions: () => [TimeSub]
 * })
 */
export function Interval(props) {
  return [intervalEffect, props]
}
