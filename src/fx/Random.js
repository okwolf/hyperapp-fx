function randomEffect(props, dispatch) {
  var randomValue = Math.random() * (props.max - props.min) + props.min
  dispatch(props.action, randomValue)
}

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
