import { makeRemoveListener } from "../utils"

function historyPopEffect(props, dispatch) {
  return makeRemoveListener(window, dispatch, props.action, "popstate")
}

/**
 * Describes an effect that will call an action whenever a user navigates through their browser history. The action will receive the state at that point in the browsers history
 *
 * @memberof module:subs
 * @param {*} action - Action to call
 * @example
 * import { HistoryPop } from "hyperapp-fx"
 *
 * app({
 *  init: { page },
 *  view: state => <App page={state.page} />,
 *  container: document.body,
 *  subscriptions: state => [HistoryPop({ action: (state, event) => event.state || state })]
 * })
 *
 */

export function HistoryPop(props) {
  return [historyPopEffect, props]
}
