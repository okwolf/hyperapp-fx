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
 *
 * const BatchedAction = state => [
 *   state,
 *   BatchFx(
 *     Effect1,
 *     Effect2,
 *     // ...
 *   )
 * ]
 */
export function BatchFx() {
  return [batchEffect, arguments]
}
