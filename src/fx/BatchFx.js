function batchEffect(fx, dispatch) {
  for (var i = 0; i < fx.length; i++) {
    fx[i].effect(fx[i].props, dispatch)
  }
}

export function BatchFx() {
  return {
    props: arguments,
    effect: batchEffect
  }
}
