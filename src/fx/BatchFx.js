function batchEffect(props, dispatch) {
  var fx = props.fx
  for (var i = 0; i < fx.length; i++) {
    fx[i].effect(fx[i], dispatch)
  }
}

export function BatchFx() {
  return {
    fx: arguments,
    effect: batchEffect
  }
}
