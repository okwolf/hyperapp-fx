function getCurrentPositionEffect(dispatch, props) {
  navigator.geolocation.getCurrentPosition(
    function (result) {
      return dispatch(props.action, result);
    },
    function (error) {
      return dispatch(props.error, error);
    },
    props.options
  );
}

/**
 * Describes an effect that will get the current user's location using the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) and then call an action with the coordinates.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {*} props.action - Action to call with the position
 * @param {*} props.error - Action to call if there is a problem getting the position
 * @param {object} props.options - An optional [`PositionOptions`](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) object
 * @example
 * import { GetCurrentPosition } from "hyperapp-fx"
 *
 * const WhereAmI = state => [
 *   state,
 *   GetCurrentPosition({
 *     action(state, position) {
 *       console.log(position);
 *     },
 *     error(state, error) {
 *       // please handle your errors...
 *     }
 *   })
 * ]
 */
export function GetCurrentPosition(props) {
  return [getCurrentPositionEffect, props];
}
