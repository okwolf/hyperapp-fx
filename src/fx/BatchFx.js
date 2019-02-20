function batchEffect(fx, dispatch) {
  for (var i = 0; i < fx.length; i++) {
    fx[i][0](fx[i][1], dispatch)
  }
}

export function BatchFx() {
  return [batchEffect, arguments]
}
