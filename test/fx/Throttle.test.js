import { runFx } from "../utils"
import { Throttle } from "../../src"

describe("Throttle effect", () => {
  it("should fire a single action immediately", () => {
    const action = jest.fn()
    const debounceFx = Throttle({ rate: 1000, action })
    const { dispatch } = runFx(debounceFx)
    expect(dispatch).toBeCalledWith(action)
  })
  it("should only fire an action once within a rate limit", () => {
    jest.useFakeTimers()
    try {
      const action = jest.fn()
      const debounceFx = Throttle({ wait: 1000, action })
      const { dispatch: dispatch1 } = runFx(debounceFx)
      const { dispatch: dispatch2 } = runFx(debounceFx)
      expect(dispatch1).toBeCalledWith(action)
      expect(dispatch2).not.toBeCalled()

      jest.runAllTimers()
      expect(dispatch2).not.toBeCalled()
      const { dispatch: dispatch3 } = runFx(debounceFx)
      expect(dispatch3).toBeCalledWith(action)
    } finally {
      jest.useRealTimers()
    }
  })
})
