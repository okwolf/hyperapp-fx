function batchEffect(fx, dispatch) {
  for (var i = 0; i < fx.length; i++) {
    fx[i][0](fx[i][1], dispatch)
  }
}

/**
 * @memberof module:fx
 * @param {...*} fx - FX to run together in a batch
 * @example
 * import { BatchFx } from "hyperapp-fx"
 */
export function BatchFx() {
  return [batchEffect, arguments]
}
