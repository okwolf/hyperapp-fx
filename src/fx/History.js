import { assign } from "../utils.js"

function historyPush(data, title, url) {
  history.pushState(data, title, url)
}

function historyPushEffect(props) {
  var title = props.title || document.title
  var url = props.url || location.href

  historyPush(props.data, title, url)
}

export function HistoryPush(props) {
  return [historyPushEffect, props]
}
