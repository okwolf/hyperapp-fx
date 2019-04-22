import { runFx } from "../utils"
import { Interval } from "../../src"

describe("Interval subscription", () => {
  it("should get the current time at an interval until unsubscribed", () => {
    jest.useFakeTimers()
    const every = 1000
    let now = 0
    global.performance.now = () => (now += every)
    try {
      const action = jest.fn()
      const intervalSub = Interval({ every, action })
      const { dispatch, unsubscribe } = runFx(intervalSub)
      expect(dispatch).not.toBeCalled()
      jest.runOnlyPendingTimers()
      expect(dispatch).toBeCalledWith(action, every)

      dispatch.mockReset()
      jest.runOnlyPendingTimers()
      expect(dispatch).toBeCalledWith(action, 2 * every)

      dispatch.mockReset()
      unsubscribe()
      jest.runOnlyPendingTimers()
      expect(dispatch).not.toBeCalled()
    } finally {
      delete global.performance.now
      jest.useRealTimers()
    }
  })
  it("should get the current date at an interval until unsubscribed", () => {
    jest.useFakeTimers()
    const every = 1000
    let now = 0
    const defaultDate = global.Date
    global.Date = () => ({ now: (now += every) })
    try {
      const action = jest.fn()
      const intervalSub = Interval({ every, asDate: true, action })
      const { dispatch, unsubscribe } = runFx(intervalSub)
      expect(dispatch).not.toBeCalled()
      jest.runOnlyPendingTimers()
      expect(dispatch).toBeCalledWith(action, { now: every })

      dispatch.mockReset()
      jest.runOnlyPendingTimers()
      expect(dispatch).toBeCalledWith(action, { now: 2 * every })

      dispatch.mockReset()
      unsubscribe()
      jest.runOnlyPendingTimers()
      expect(dispatch).not.toBeCalled()
    } finally {
      global.Date = defaultDate
      jest.useRealTimers()
    }
  })
})
