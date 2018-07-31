import { makeRemoveListener } from "./utils.js"

function keyboardEffect(props, dispatch) {
  var action = props.action
  var removeDown = props.downs
    ? makeRemoveListener("keydown", dispatch, action)
    : null
  var removeUp = props.ups
    ? makeRemoveListener("keyup", dispatch, action)
    : null
  var removePress = props.presses
    ? makeRemoveListener("keypress", dispatch, action)
    : null
  return function() {
    removeDown && removeDown()
    removeUp && removeUp()
    removePress && removePress()
  }
}

export function Keyboard(props) {
  return {
    props: props,
    effect: keyboardEffect
  }
}
