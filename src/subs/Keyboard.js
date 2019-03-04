import { makeRemoveListener } from "../utils.js"

function keyboardEffect(props, dispatch) {
  var removeListenerForEvent = makeRemoveListener.bind(
    null,
    document,
    dispatch,
    props.action
  )
  var removeDown = props.downs ? removeListenerForEvent("keydown") : null
  var removeUp = props.ups ? removeListenerForEvent("keyup") : null
  var removePress = props.presses ? removeListenerForEvent("keypress") : null
  return function() {
    removeDown && removeDown()
    removeUp && removeUp()
    removePress && removePress()
  }
}

/**
 * Describes an effect that can capture [keydown](https://developer.mozilla.org/en-US/docs/Web/Events/keydown), [keyup](https://developer.mozilla.org/en-US/docs/Web/Events/keyup), and [keypress](https://developer.mozilla.org/en-US/docs/Web/Events/keypress) events for your entire document. The [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) will be provided as the action `data`.
 *
 * @memberof module:subs
 * @param {object} props
 * @param {boolean} props.downs - listen for keydown events
 * @param {boolean} props.ups - listen for keyup events
 * @param {boolean} props.presses - listen for keypress events
 * @param {*} props.action - action to call when keyboard events are fired
 * @example
 * import { Keyboard } from "hyperapp-fx"
 */
export function Keyboard(props) {
  return [keyboardEffect, props]
}
