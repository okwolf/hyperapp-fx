export function assign(source, assignments) {
  var result = {},
    i
  for (i in source) result[i] = source[i]
  for (i in assignments) result[i] = assignments[i]
  return result
}

export function makeRemoveListener(attachTo, dispatch, action, eventName) {
  var handler = dispatch.bind(null, action)
  attachTo.addEventListener(eventName, handler)
  return function() {
    attachTo.removeEventListener(eventName, handler)
  }
}

export function makeDispatchTime(dispatch, props) {
  return function() {
    dispatch(props.action, props.asDate ? new Date() : performance.now())
  }
}

var webSocketConnections = {}

export function getOpenWebSocket(props) {
  var connection = webSocketConnections[props.url]
  if (!connection) {
    var socket = props.ws_constructor
      ? new props.ws_constructor(props.url, props.protocols)
      : new WebSocket(props.url, props.protocols)
    connection = {
      socket: socket,
      listeners: []
    }
    webSocketConnections[props.url] = connection
  }
  return connection
}

export function closeWebSocket(props) {
  var connection = getOpenWebSocket(props)
  // FIXME: handle close on opening
  connection.socket.close()
  delete webSocketConnections[props.url]
}
