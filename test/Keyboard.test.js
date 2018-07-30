import { runFx } from "./runFx"
import { Keyboard } from "../src"

describe("Keyboard effect", () => {
  it("should add and remove keydown listener", () => {
    const keyEvent = new KeyboardEvent("keydown", { key: "a", code: "KeyA" })
    const action = jest.fn()
    const keyboardFx = Keyboard({ downs: true, action })
    const { dispatch, unsubscribe } = runFx(keyboardFx)
    document.dispatchEvent(new KeyboardEvent("keydown", keyEvent))
    expect(dispatch).toBeCalledWith(action, keyEvent)

    dispatch.mockReset()
    unsubscribe()
    document.dispatchEvent(new KeyboardEvent("keydown", keyEvent))
    expect(dispatch).not.toBeCalled()
  })
  it("should attach keyup listener", () => {
    const keyEvent = new KeyboardEvent("keyup", { key: "a", code: "KeyA" })
    const action = jest.fn()
    const keyboardFx = Keyboard({ ups: true, action })
    const { dispatch, unsubscribe } = runFx(keyboardFx)
    document.dispatchEvent(new KeyboardEvent("keyup", keyEvent))
    expect(dispatch).toBeCalledWith(action, keyEvent)

    dispatch.mockReset()
    unsubscribe()
    document.dispatchEvent(new KeyboardEvent("keyup", keyEvent))
    expect(dispatch).not.toBeCalled()
  })
  it("should attach keypress listener", () => {
    const keyEvent = new KeyboardEvent("keypress", { key: "a", code: "KeyA" })
    const action = jest.fn()
    const keyboardFx = Keyboard({ presses: true, action })
    const { dispatch, unsubscribe } = runFx(keyboardFx)
    document.dispatchEvent(new KeyboardEvent("keypress", keyEvent))
    expect(dispatch).toBeCalledWith(action, keyEvent)

    dispatch.mockReset()
    unsubscribe()
    document.dispatchEvent(new KeyboardEvent("keypress", keyEvent))
    expect(dispatch).not.toBeCalled()
  })
})
