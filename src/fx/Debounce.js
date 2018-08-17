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

export function Debounce(props) {
  return {
    props: props,
    effect: debounceEffect
  }
}
