function keyboardEffect(props, dispatch) {
  function makeRemoveListener(eventName) {
    function handler(keyEvent) {
      dispatch(props.action, keyEvent)
    }
    document.addEventListener(eventName, handler)
    return function() {
      document.removeEventListener(eventName, handler)
    }
  }

  var removeDown = props.downs ? makeRemoveListener("keydown") : null
  var removeUp = props.ups ? makeRemoveListener("keyup") : null
  var removePress = props.presses ? makeRemoveListener("keypress") : null
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
