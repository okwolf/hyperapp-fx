import { runFx } from "../utils"
import { WebSocketClient } from "../../src"

describe("WebSocketClient", () => {
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
    const webSocketFx = WebSocketClient({ url })
    const { unsubscribe } = runFx(webSocketFx)

    expect(WebSocket).toBeCalledWith(url, undefined)
    expect(mockWebSocket.close).not.toBeCalled()

    unsubscribe()
    expect(mockWebSocket.close).toBeCalled()
  })
  it("should create a new WebSocket with protocols if not connected and close on unsubscribe", () => {
    const protocols = ["soap", "wamp"]
    const webSocketFx = WebSocketClient({ url, protocols })
    const { unsubscribe } = runFx(webSocketFx)

    expect(WebSocket).toBeCalledWith(url, protocols)
    expect(mockWebSocket.close).not.toBeCalled()

    unsubscribe()
    expect(mockWebSocket.close).toBeCalled()
  })

  it("should send a message if connected", () => {
    const message = { some: "message value" }
    const webSocketFx = WebSocketClient({ url, send: message })
    const { unsubscribe } = runFx(webSocketFx)

    expect(mockWebSocket.send).toBeCalledWith(message)
    unsubscribe()
  })
  it("should queue sending a message if not connected and remove the listener on unsubscribe", () => {
    mockWebSocket.readyState = 0
    const message = { some: "message value" }
    const webSocketFx = WebSocketClient({ url, send: message })
    const { dispatch, unsubscribe } = runFx(webSocketFx)

    expect(mockWebSocket.addEventListener).toBeCalledWith(
      "open",
      expect.any(Function)
    )
    expect(mockWebSocket.send).not.toBeCalled()
    expect(mockWebSocket.removeEventListener).not.toBeCalled()

    const openListener = mockWebSocket.addEventListener.mock.calls[0][1]
    openListener()
    expect(dispatch).toBeCalledWith(expect.any(Function))
    dispatch.mock.calls[0][0]()
    expect(mockWebSocket.send).toBeCalledWith(message)

    unsubscribe()
    expect(mockWebSocket.removeEventListener).toBeCalledWith(
      "open",
      expect.any(Function)
    )
  })
  it("should listen for messages and remove the listener on unsubscribe", () => {
    const message = JSON.stringify({ some: "message value" })
    const listen = jest.fn()
    const webSocketFx = WebSocketClient({ url, listen })
    const { dispatch, unsubscribe } = runFx(webSocketFx)

    expect(mockWebSocket.addEventListener).toBeCalledWith(
      "message",
      expect.any(Function)
    )
    expect(mockWebSocket.removeEventListener).not.toBeCalled()

    const messageListener = mockWebSocket.addEventListener.mock.calls[0][1]
    messageListener(message)
    expect(dispatch).toBeCalledWith(listen, message)

    unsubscribe()
    expect(mockWebSocket.removeEventListener).toBeCalledWith(
      "message",
      expect.any(Function)
    )
  })
  it("should handle errors and remove the listener on unsubscribe", () => {
    const errorMessage = new Error("uh oh!")
    const error = jest.fn()
    const webSocketFx = WebSocketClient({ url, error })
    const { dispatch, unsubscribe } = runFx(webSocketFx)

    expect(mockWebSocket.addEventListener).toBeCalledWith(
      "error",
      expect.any(Function)
    )
    expect(mockWebSocket.removeEventListener).not.toBeCalled()

    const errorListener = mockWebSocket.addEventListener.mock.calls[0][1]
    errorListener(errorMessage)
    expect(dispatch).toBeCalledWith(error, errorMessage)

    unsubscribe()
    expect(mockWebSocket.removeEventListener).toBeCalledWith(
      "error",
      expect.any(Function)
    )
  })
  it("should reuse an existing WebSocket and not close the socket if another socket is already listening", () => {
    const listen1 = jest.fn()
    const webSocketFx1 = WebSocketClient({ url, listen: listen1 })
    const { unsubscribe: unsubscribe1 } = runFx(webSocketFx1)

    WebSocket.mockReset()
    const listen2 = jest.fn()
    const webSocketFx2 = WebSocketClient({ url, listen: listen2 })
    const { unsubscribe: unsubscribe2 } = runFx(webSocketFx2)
    expect(WebSocket).not.toBeCalled()

    unsubscribe1()
    expect(mockWebSocket.close).not.toBeCalled()
    unsubscribe2()
    expect(mockWebSocket.close).toBeCalled()
  })
})
