export function assign(source, assignments) {
  const result = {};
  let i;
  for (i in source) result[i] = source[i];
  for (i in assignments) result[i] = assignments[i];
  return result;
}

export function makeRemoveListener(attachTo, dispatch, action, eventName) {
  const handler = dispatch.bind(null, action);
  attachTo.addEventListener(eventName, handler);
  return function () {
    attachTo.removeEventListener(eventName, handler);
  };
}

export function makeDispatchTime(dispatch, props) {
  return function () {
    dispatch(props.action, props.asDate ? new Date() : performance.now());
  };
}

const webSocketConnections = {};

export function getOpenWebSocket(props) {
  let connection = webSocketConnections[props.url];
  if (!connection) {
    connection = {
      socket: new WebSocket(props.url, props.protocols),
      listeners: []
    };
    webSocketConnections[props.url] = connection;
  }
  return connection;
}

export function closeWebSocket(props) {
  const connection = getOpenWebSocket(props);
  // FIXME: handle close on opening
  connection.socket.close();
  delete webSocketConnections[props.url];
}
