import { runFx } from "../utils"
import { Now, Delay } from "../../src"

describe("Now effect", () => {
  it("should get the current time", () => {
    const timestamp = 9001
    global.performance.now = () => timestamp

    const action = jest.fn()
    const timeFx = Now({ action })
    const { dispatch } = runFx(timeFx)
    expect(dispatch).toBeCalledWith(action, timestamp)

    delete global.performance.now
  })
  it("should get the current date", () => {
    const timestamp = 9001
    const defaultDate = global.Date
    global.Date = () => ({ timestamp })

    const action = jest.fn()
    const timeFx = Now({ asDate: true, action })
    const { dispatch } = runFx(timeFx)
    expect(dispatch).toBeCalledWith(action, { timestamp })

    global.Date = defaultDate
  })
})

describe("Delay effect", () => {
  it("should get the current time after a delay", () => {
    jest.useFakeTimers()
    const timestamp = 666
    global.performance.now = () => timestamp
    try {
      const action = jest.fn()
      const timeFx = Delay({ wait: timestamp, action })
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
      const timeFx = Delay({ wait: timestamp, asDate: true, action })
      const { dispatch } = runFx(timeFx)
      expect(dispatch).not.toBeCalled()
      jest.runAllTimers()
      expect(dispatch).toBeCalledWith(action, { timestamp })
    } finally {
      global.Date = defaultDate
      jest.useRealTimers()
    }
  })
})
