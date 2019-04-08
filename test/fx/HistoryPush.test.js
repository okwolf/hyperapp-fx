import { runFx } from "../utils"
import { HistoryPush } from "../../src"

describe("HistoryPush effect", () => {
  it("pushing to state should update location and state, and increment history length", () => {
    const historyPush = HistoryPush({
      state: {},
      title: "new title",
      url: "#foo"
    })
    expect(history.length).toEqual(1)
    expect(history.state).toEqual(null)
    runFx(historyPush)
    expect(history.length).toEqual(2)
    expect(location.hash).toEqual("#foo")
    expect(history.state).toEqual({})
  })

  it("pushing to state should send correct params", () => {
    history.pushState = jest.fn()
    const historyPush = HistoryPush({
      state: {},
      title: "new title",
      url: "#foo"
    })
    runFx(historyPush)
    expect(history.pushState).toHaveBeenCalledWith({}, "new title", "#foo")
  })
})
