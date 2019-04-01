import { assign } from "../utils.js"

function historyPush(state, title, url) {
  history.pushState(state, title, url)
}

function historyPushEffect(props) {
  var title = props.title || document.title
  var url = props.url || location.href

  historyPush(props.state, title, url)
}

/**
 * Describes an effect that will update the browsers navigation history with the supplied location and state.
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
