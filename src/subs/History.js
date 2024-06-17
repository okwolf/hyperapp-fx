import { makeRemoveListener } from "../utils.js";

function historyPopEffect(dispatch, props) {
  return makeRemoveListener(window, dispatch, props.action, "popstate");
}

/**
 * Describes an effect that will call an action whenever a user navigates through their browser [`history`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView/popstate_event). The action will receive the state at that point in the browsers history.
 *
 * @memberof module:subs
 * @param {*} action - Action to call
 * @example
 * import { h, app } from "hyperapp"
 * import { HistoryPop } from "hyperapp-fx"
 *
 * app({
 *   init: { page: 1 },
 *   view: state => <App page={state.page} />,
 *   container: document.body,
 *   subscriptions: state => [
 *     HistoryPop({ action: (state, event) => event.state || state })
 *   ]
 * })
 */

export function HistoryPop(props) {
  return [historyPopEffect, props];
}
