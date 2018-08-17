import { runFx } from "../utils"
import { Debounce } from "../../src"

describe("Debounce effect", () => {
  it("should fire an action after a delay", () => {
    jest.useFakeTimers()
    try {
      const action = jest.fn()
      const debounceFx = Debounce({ wait: 1000, action })
      const { dispatch } = runFx(debounceFx)
      expect(dispatch).not.toBeCalled()

      jest.runAllTimers()
      expect(dispatch).toBeCalledWith(action)
    } finally {
      jest.useRealTimers()
    }
  })
  it("should only fire the last action fired while waiting", () => {
    jest.useFakeTimers()
    try {
      const action = jest.fn()
      const debounceFx = Debounce({ wait: 1000, action })
      const { dispatch: dispatch1 } = runFx(debounceFx)
      const { dispatch: dispatch2 } = runFx(debounceFx)
      expect(dispatch1).not.toBeCalled()
      expect(dispatch2).not.toBeCalled()

      jest.runAllTimers()
      expect(dispatch1).not.toBeCalled()
      expect(dispatch2).toBeCalledWith(action)
    } finally {
      jest.useRealTimers()
    }
  })
})
