import { assign } from "../utils.js"

function historyPush(state, title, url) {
  history.pushState(state, title, url)
}

function historyPushEffect(props) {
  var title = props.title || document.title
  var url = props.url || location.href

  historyPush(props.state, title, url)
}

export function HistoryPush(props) {
  return [historyPushEffect, props]
}
