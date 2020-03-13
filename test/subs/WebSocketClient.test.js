import { runFx } from "../utils"
import { WebSocketListen } from "../../src"

describe("WebSocketListen subscription", () => {
  const url = "wss://localhost"
  const mockWebSocket = {}
  const defaultWebSocket = global.WebSocket
  beforeEach(() => {
    mockWebSocket.readyState = 1
    mockWebSocket.send = jest.fn()
    mockWebSocket.addEventListener = jest.fn()
    mockWebSocket.removeEventListener = jest.fn()
    mockWebSocket.close = jest.fn()
    global.WebSocket = jest.fn(() => mockWebSocket)
  })
  afterEach(() => {
    global.WebSocket = defaultWebSocket
  })
  it("should create a new WebSocket without protocols if not connected and close on unsubscribe", () => {
    const webSocketFx = WebSocketListen({ url })
    const { unsubscribe } = runFx(webSocketFx)

    expect(WebSocket).toBeCalledWith(url, undefined)
    expect(mockWebSocket.close).not.toBeCalled()

    unsubscribe()
    expect(mockWebSocket.close).toBeCalled()
  })
  it("should create a new WebSocket with protocols if not connected and close on unsubscribe", () => {
    const protocols = ["soap", "wamp"]
    const webSocketFx = WebSocketListen({ url, protocols })
    const { unsubscribe } = runFx(webSocketFx)

    expect(WebSocket).toBeCalledWith(url, protocols)
    expect(mockWebSocket.close).not.toBeCalled()

    unsubscribe()
    expect(mockWebSocket.close).toBeCalled()
  })
  it("should listen for messages and remove the listener on unsubscribe", () => {
    const message = JSON.stringify({ some: "message value" })
    const action = jest.fn()
    const webSocketFx = WebSocketListen({ url, action })
    const { dispatch, unsubscribe } = runFx(webSocketFx)

    expect(mockWebSocket.addEventListener).toBeCalledWith(
      "message",
      expect.any(Function)
    )
    expect(mockWebSocket.removeEventListener).not.toBeCalled()

    const messageListener = mockWebSocket.addEventListener.mock.calls[0][1]
    messageListener(message)
    expect(dispatch).toBeCalledWith(action, message)

    unsubscribe()
    expect(mockWebSocket.removeEventListener).toBeCalledWith(
      "message",
      expect.any(Function)
    )
  })
  it("should handle errors and remove the listener on unsubscribe", () => {
    const errorMessage = new Error("uh oh!")
    const error = jest.fn()
    const webSocketFx = WebSocketListen({ url, error })
    const { dispatch, unsubscribe } = runFx(webSocketFx)

    expect(mockWebSocket.addEventListener).toBeCalledWith(
      "error",
      expect.any(Function)
    )
    expect(mockWebSocket.removeEventListener).not.toBeCalled()

    const errorListener = mockWebSocket.addEventListener.mock.calls[1][1]
    errorListener(errorMessage)
    expect(dispatch).toBeCalledWith(error, errorMessage)

    unsubscribe()
    expect(mockWebSocket.removeEventListener).toBeCalledWith(
      "error",
      expect.any(Function)
    )
  })
  it("should reuse an existing WebSocket and not close the socket if another socket is already listening", () => {
    const onopen = jest.fn()
    const onclose = jest.fn()

    const listen1 = jest.fn()
    const webSocketFx1 = WebSocketListen({
      url,
      listen: listen1,
      open: onopen,
      close: onclose
    })
    const { unsubscribe: unsubscribe1 } = runFx(webSocketFx1)

    WebSocket.mockReset()
    const listen2 = jest.fn()
    const webSocketFx2 = WebSocketListen({
      url,
      listen: listen2,
      open: onopen,
      close: onclose
    })
    const { unsubscribe: unsubscribe2 } = runFx(webSocketFx2)
    expect(WebSocket).not.toBeCalled()

    unsubscribe1()
    expect(mockWebSocket.close).not.toBeCalled()
    unsubscribe2()
    expect(mockWebSocket.close).toBeCalled()
  })
})
