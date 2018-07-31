import { runFx } from "./runFx"
import { AnimationFrame } from "../src"

describe("AnimationFrame effect", () => {
  it("should fire an action each frame until unsubscribed", () => {
    const cancelId = 9001
    const timestamp = 1001
    const defaultRequestAnimationFrame = requestAnimationFrame
    const defaultCancelAnimationFrame = cancelAnimationFrame
    global.requestAnimationFrame = jest.fn().mockImplementationOnce(cb => {
      cb(timestamp)
      return cancelId
    })
    global.cancelAnimationFrame = jest.fn()
    const action = jest.fn()
    const frameFx = AnimationFrame(action)
    const { dispatch, unsubscribe } = runFx(frameFx)
    expect(dispatch).toBeCalledWith(action, timestamp)
    expect(requestAnimationFrame).toBeCalledWith(expect.any(Function))

    unsubscribe()
    expect(global.cancelAnimationFrame).toBeCalledWith(cancelId)
    global.requestAnimationFrame = defaultRequestAnimationFrame
    global.cancelAnimationFrame = defaultCancelAnimationFrame
  })
})
