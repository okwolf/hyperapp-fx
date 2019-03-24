import { makeRemoveListener } from "../utils"

function historyPopEffect(props, dispatch) {
  return makeRemoveListener(window, dispatch, props.action, "popstate")
}

/**
 * Describes an effect that will call an action whenever a user navigates backwards in their browser history. The action will receive the state at that point in the browsers history
 *
 * @memberof module:subs
 * @param {*} action - Action to call
 * @example
 * import { HistoryPop } from "hyperapp-fx"
 */

export function HistoryPop(props) {
  return [historyPopEffect, props]
}
