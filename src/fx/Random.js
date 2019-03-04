function randomEffect(props, dispatch) {
  var randomValue = Math.random() * (props.max - props.min) + props.min
  dispatch(props.action, randomValue)
}

/**
 * Describes an effect that will call an action with a [randomly generated number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) within a range. If provided the range will be `[min, max)` or else the default range is `[0, 1)`. The random number will be provided as the action `data`.

Use [`Math.floor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor) if you want a random integer instead of a floating-point number. Remember the range will be `max` exclusive, so use your largest desired int + 1.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {*} props.action - action to call with the random number result
 * @param {number} props.min - minimum random number to generate
 * @param {number} props.max - maximum random number to generate
 * @example
 * import { Random } from "hyperapp-fx"
 */
export function Random(props) {
  return [
    randomEffect,
    {
      action: props.action,
      min: props.min || 0,
      max: props.max || 1
    }
  ]
}
