var debounceTimeouts = []
function debounceEffect(props, dispatch) {
  var timeout = debounceTimeouts.find(function(nextTimeout) {
    return nextTimeout[0] === props.action
  })
  if (!timeout) {
    timeout = [props.action]
    debounceTimeouts.push(timeout)
  } else {
    clearTimeout(timeout[1])
  }

  timeout[1] = setTimeout(function() {
    dispatch(props.action)
  }, props.wait)
}

/**
 * Describes an effect that will call an action after waiting for a delay to pass. The delay will be reset each time the action is called.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {number} props.wait - delay to wait before calling the action
 * @param {*} props.action - action to debounce
 * @example
 * import { Debounce } from "hyperapp-fx"
 */
export function Debounce(props) {
  return [debounceEffect, props]
}
