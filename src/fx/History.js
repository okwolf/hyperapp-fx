function historyPushEffect(props) {
  var title = props.title || document.title
  var url = props.url || location.href

  history.pushState(props.state, title, url)
}

function historyReplaceEffect(props) {
  var title = props.title || document.title
  var url = props.url || location.href

  history.replaceState(props.state, title, url)
}

/**
 * Describes an effect that will add an entry to the browsers navigation [`history`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries) with the supplied location and state.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {*} props.state - data to add to browser history
 * @param {string} props.url - url to add to browser history
 * @param {string} props.title - title to set document to
 * @example
 * import { Console } from "hyperapp-fx"
 *
 * export const UpdateHistory = state => [
 *   state,
 *   HistoryPush({
 *     state,
 *     title: document.title,
 *     url: '#foo'
 *   })
 * ]
 */

export function HistoryPush(props) {
  return [historyPushEffect, props]
}

/**
 * Describes an effect that will replace the browsers current [`history`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries) navigation entry with the supplied location and state.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {*} props.state - data to add to browser history
 * @param {string} props.url - url to add to browser history
 * @param {string} props.title - title to set document to
 * @example
 * import { Console } from "hyperapp-fx"
 *
 * export const InitialiseHistory = state => [
 *   state,
 *   HistoryReplace({
 *     state,
 *     title: document.title,
 *     url: '#foo'
 *   })
 * ]
 */

export function HistoryReplace(props) {
  return [historyReplaceEffect, props]
}
