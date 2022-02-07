import { assign } from "../utils.js"

function mergeEffect(dispatch, props) {
  dispatch(function (state) {
    return assign(state, props.action(state))
  })
}

/**
 * Describes an effect that will shallow-merge the results from actions that return partial state.
 *
 * @memberof module:fx
 * @param {function(object): object} action - an action function that takes state and returns a partial new state which will be shallow-merged with the previous state
 * @example
 * import { Merge } from "hyperapp-fx"
 *
 * const MergingAction = state => [
 *   state,
 *   Merge(ActionReturningPartialState)
 * ]
 */
export function Merge(action) {
  return [mergeEffect, { action: action }]
}
