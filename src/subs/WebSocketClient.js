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
  function sendMessage(state) {
    connection.socket.send(props.send)
    return state
  }
  var removeOpen
  if (props.send) {
    if (connection.socket.readyState === CONNECTING) {
      removeOpen = makeRemoveListener(
        connection.socket,
        dispatch,
        sendMessage,
        "open"
      )
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
    removeOpen && removeOpen()
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
