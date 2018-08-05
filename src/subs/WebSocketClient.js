import { makeRemoveListener } from "../utils.js"

var CONNECTING = 0
var connections = {}

function webSocketEffect(props, dispatch) {
  var connection = connections[props.url]
  if (!connection) {
    connection = {
      socket: new WebSocket(props.url, props.protocols),
      listeners: []
    }
    connections[props.url] = connection
  }
  function sendMessage() {
    connection.socket.send(props.send)
  }
  if (props.send) {
    if (connection.socket.readyState === CONNECTING) {
      connection.socket.addEventListener("open", sendMessage)
    } else {
      sendMessage()
    }
  }
  var removeListen
  if (props.listen) {
    removeListen = makeRemoveListener(
      connection.socket,
      dispatch,
      props.listen,
      "message"
    )
    connection.listeners.push(removeListen)
  }
  var removeError
  if (props.error) {
    removeError = makeRemoveListener(
      connection.socket,
      dispatch,
      props.error,
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
      delete connections[props.url]
    }
  }
}

export function WebSocketClient(props) {
  return {
    props: props,
    effect: webSocketEffect
  }
}
