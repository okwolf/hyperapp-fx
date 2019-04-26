import { getOpenWebSocket } from "../utils.js"

function webSocketSendEffect(props) {
  var connection = getOpenWebSocket(props)
  function sendMessage() {
    connection.socket.send(props.data)
    connection.socket.removeEventListener("open", sendMessage)
  }
  if (connection.socket.readyState === WebSocket.CONNECTING) {
    connection.socket.addEventListener("open", sendMessage)
  } else {
    sendMessage()
  }
}

/**
 * Describes an effect that will open a [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) connection for a given URL (and optional protocols) and send a message reusing existing connections.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {string} props.url - The URL to which to connect; this should be the URL to which the WebSocket server will respond
 * @param {string | string[]} props.protocols - Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified `protocol`). If you don't specify a protocol string, an empty string is assumed.
 * @param {*} props.data - data to send once connected
 * @example
 * import { WebSocketSend } from "hyperapp-fx"
 *
 *  const SendAction = state => [
 *   state,
 *   WebSocketSend({
 *     url: "wss://example.com",
 *     data: JSON.stringify({
 *       sendThisData: "on connecting"
 *     })
 *   })
 * ]
 */
export function WebSocketSend(props) {
  return [webSocketSendEffect, props]
}
