import { runFx } from "../utils"
import { WebSocketSend } from "../../src"

describe("WebSocketSend effect", () => {
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
    global.WebSocket.CONNECTING = 0
  })
  afterEach(() => {
    global.WebSocket = defaultWebSocket
  })
  it("should create a new WebSocket without protocols if not connected", () => {
    const webSocketFx = WebSocketSend({ url })
    runFx(webSocketFx)

    expect(WebSocket).toBeCalledWith(url, undefined)
    expect(mockWebSocket.close).not.toBeCalled()
  })
  it("should send a message if connected", () => {
    const message = { some: "message value" }
    const webSocketFx = WebSocketSend({ url, data: message })
    runFx(webSocketFx)

    expect(mockWebSocket.send).toBeCalledWith(message)
  })
  it("should queue sending a message if not connected", () => {
    mockWebSocket.readyState = 0
    const message = { some: "message value" }
    const webSocketFx = WebSocketSend({ url, data: message })
    runFx(webSocketFx)

    expect(mockWebSocket.addEventListener).toBeCalledWith(
      "open",
      expect.any(Function)
    )
    expect(mockWebSocket.send).not.toBeCalled()
    expect(mockWebSocket.removeEventListener).not.toBeCalled()

    const openListener = mockWebSocket.addEventListener.mock.calls[0][1]
    openListener()
    expect(mockWebSocket.send).toBeCalledWith(message)
    expect(mockWebSocket.removeEventListener).toBeCalledWith(
      "open",
      expect.any(Function)
    )
  })
})
