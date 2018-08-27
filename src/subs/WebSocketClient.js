import { makeRemoveListener, assign } from "../utils.js"

var CONNECTING = 0
var connections = {}

function webSocketEffect(sub, dispatch) {
  var connection = connections[sub.url]
  if (!connection) {
    connection = {
      socket: new WebSocket(sub.url, sub.protocols),
      listeners: []
    }
    connections[sub.url] = connection
  }
  function sendMessage() {
    connection.socket.send(sub.send)
  }
  if (sub.send) {
    if (connection.socket.readyState === CONNECTING) {
      connection.socket.addEventListener("open", sendMessage)
    } else {
      sendMessage()
    }
  }
  var removeListen
  if (sub.listen) {
    removeListen = makeRemoveListener(
      connection.socket,
      dispatch,
      sub.listen,
      "message"
    )
    connection.listeners.push(removeListen)
  }
  var removeError
  if (sub.error) {
    removeError = makeRemoveListener(
      connection.socket,
      dispatch,
      sub.error,
      "error"
    )
    connection.listeners.push(removeError)
  }

  return function() {
    removeListen && removeListen()
    removeError && removeError()
    connection.listeners = connection.listeners.filter(function(listener) {
      return listener !== removeListen && listener !== removeError
    })
    if (connection.listeners.length === 0) {
      connection.socket.close()
      delete connections[sub.url]
    }
  }
}

export function WebSocketClient(props) {
  return assign(props, {
    effect: webSocketEffect
  })
}
