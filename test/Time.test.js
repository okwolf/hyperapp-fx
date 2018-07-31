import { runFx } from "./runFx"
import { Time } from "../src"

describe("Time effect", () => {
  it("should get the current time", () => {
    const timestamp = 9001
    global.performance.now = () => timestamp

    const action = jest.fn()
    const timeFx = Time({ now: true, action })
    const { dispatch } = runFx(timeFx)
    expect(dispatch).toBeCalledWith(action, timestamp)

    delete global.performance.now
  })
  it("should get the current date", () => {
    const timestamp = 9001
    const defaultDate = global.Date
    global.Date = () => ({ timestamp })

    const action = jest.fn()
    const timeFx = Time({ now: true, asDate: true, action })
    const { dispatch } = runFx(timeFx)
    expect(dispatch).toBeCalledWith(action, { timestamp })

    global.Date = defaultDate
  })
  it("should get the current time after a delay", () => {
    jest.useFakeTimers()
    const timestamp = 666
    global.performance.now = () => timestamp
    try {
      const action = jest.fn()
      const timeFx = Time({ after: timestamp, action })
      const { dispatch } = runFx(timeFx)
      expect(dispatch).not.toBeCalled()
      jest.runAllTimers()
      expect(dispatch).toBeCalledWith(action, timestamp)
    } finally {
      delete global.performance.now
      jest.useRealTimers()
    }
  })
  it("should get the current date after a delay", () => {
    jest.useFakeTimers()
    const timestamp = 666
    const defaultDate = global.Date
    global.Date = () => ({ timestamp })
    try {
      const action = jest.fn()
      const timeFx = Time({ after: timestamp, asDate: true, action })
      const { dispatch } = runFx(timeFx)
      expect(dispatch).not.toBeCalled()
      jest.runAllTimers()
      expect(dispatch).toBeCalledWith(action, { timestamp })
    } finally {
      global.Date = defaultDate
      jest.useRealTimers()
    }
  })
  it("should cancel getting the current time before the delay ends", () => {
    jest.useFakeTimers()
    const timestamp = 666
    global.performance.now = () => timestamp
    try {
      const action = jest.fn()
      const timeFx = Time({ after: timestamp, action })
      const { dispatch, unsubscribe } = runFx(timeFx)
      expect(dispatch).not.toBeCalled()
      unsubscribe()
      jest.runAllTimers()
      expect(dispatch).not.toBeCalled()
    } finally {
      delete global.performance.now
      jest.useRealTimers()
    }
  })
  it("should get the current time at an interval until unsubscribed", () => {
    jest.useFakeTimers()
    const every = 1000
    let now = 0
    global.performance.now = () => (now += every)
    try {
      const action = jest.fn()
      const timeFx = Time({ every, action })
      const { dispatch, unsubscribe } = runFx(timeFx)
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
      const timeFx = Time({ every, asDate: true, action })
      const { dispatch, unsubscribe } = runFx(timeFx)
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
