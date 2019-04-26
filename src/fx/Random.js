function generateRandom(props) {
  if (props.values) {
    return props.values.map(generateRandom)
  }
  var min = props.min || 0
  var max = props.max || 1
  if (props.int) max++
  if (props.bool) {
    min = 0
    max = 2
  }
  var randomValue = Math.random() * (max - min) + min
  if (props.int || props.bool) {
    randomValue = Math.floor(randomValue)
  }
  if (props.bool) {
    randomValue = !!randomValue
  }
  return randomValue
}

function randomEffect(props, dispatch) {
  var randomValue = generateRandom(props)
  dispatch(props.action, randomValue)
}

/**
 * Describes an effect that will call an action with one or more randomly generated value(s).
 * If provided the range for [random numeric values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) will be `[min, max)` or else the default range is `[0, 1)`. Also `bool`eans, `int`egers, and arrays of `values` are supported. The random value will be provided as the action `data`.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {*} props.action - action to call with the random number result
 * @param {number} props.min - minimum random number to generate
 * @param {number} props.max - maximum random number to generate
 * @param {boolean} props.int - round number to nearest integer
 * @param {boolean} props.bool - generate a boolean instead of a number (ignores numeric options)
 * @param {object[]} props.values - generate an array of values (ignores other options, each object accepts same props as the root)
 * @example
 * import { Random } from "hyperapp-fx"
 *
 * const RollDie = state => [
 *   state,
 *   Random({
 *     min: 1,
 *     max: 7,
 *     int: true,
 *     action: (_, roll) => {
 *       // roll will be an int from 1-6
 *
 *       // return new state using roll
 *     }
 *   })
 * ]
 */
export function Random(props) {
  return [randomEffect, props]
}
