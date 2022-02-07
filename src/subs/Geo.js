function watchPositionEffect(dispatch, props) {
  var cancelId = navigator.geolocation.watchPosition(
    function (result) {
      return dispatch(props.action, result)
    },
    function (error) {
      return dispatch(props.error, error)
    },
    props.options
  )

  return function () {
    navigator.geolocation.clearWatch(cancelId)
  }
}

/**
 * Describes an effect that can monitor geolocation using the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API), sending updates each time the location is updated
 *
 * @memberof module:subs
 * @param {object} props
 * @param {*} props.action - required action to call each time the location changes
 * @param {*} props.error - optional action to call on error
 * @param {object} props.options - An optional [`PositionOptions`](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) object
 * @example
 * import { WatchPosition } from "hyperapp-fx"
 *
 * const GeoSub = WatchPosition({
 *   action: (state, position) => {
 *     state.user_location = position.coords,
 *   }
 * })
 */
export function WatchPosition(props) {
  return [watchPositionEffect, props]
}
