import { makeRemoveListener, assign } from "../utils.js"

function keyboardEffect(sub, dispatch) {
  var removeListenerForEvent = makeRemoveListener.bind(
    null,
    document,
    dispatch,
    sub.action
  )
  var removeDown = sub.downs ? removeListenerForEvent("keydown") : null
  var removeUp = sub.ups ? removeListenerForEvent("keyup") : null
  var removePress = sub.presses ? removeListenerForEvent("keypress") : null
  return function() {
    removeDown && removeDown()
    removeUp && removeUp()
    removePress && removePress()
  }
}

export function Keyboard(props) {
  return assign(props, {
    effect: keyboardEffect
  })
}
