import { runFx } from "../utils"
import { HistoryReplace } from "../../src"

describe("HistoryReplace Effect", () => {
  it("replacing state should update location and state, and not increment history length", () => {
    const historyReplace = HistoryReplace({
      state: {},
      title: "new title",
      url: "#bar"
    })

    expect(history.length).toEqual(1)
    expect(history.state).toEqual(null)
    runFx(historyReplace)
    expect(history.length).toEqual(1)
    expect(location.hash).toEqual("#bar")
    expect(history.state).toEqual({})
  })

  it("replacing state should send correct params", () => {
    history.replaceState = jest.fn()
    const historyReplace = HistoryReplace({
      state: {},
      title: "new title",
      url: "#foo"
    })
    runFx(historyReplace)
    expect(history.replaceState).toHaveBeenCalledWith({}, "new title", "#foo")
  })
})
