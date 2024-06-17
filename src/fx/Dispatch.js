function dispatchEffect(dispatch, props) {
  dispatch(props.action);
}

/**
 * Describes an effect that will dispatch whatever action is passed to it. Useful for batching actions and FX together.
 *
 * @memberof module:fx
 * @param {*} action - an action to dispatch
 * @example
 * import { Dispatch } from "hyperapp-fx"
 *
 * const BatchedFxAndActions = state => [
 *   state,
 *   SomeFx,
 *   Dispatch(SomeAction)
 * ]
 */
export function Dispatch(action) {
  return [dispatchEffect, { action: action }];
}
