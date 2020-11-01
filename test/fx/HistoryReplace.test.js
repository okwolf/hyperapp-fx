import { runFx } from "../utils"
import { HistoryReplace } from "../../src"

describe("HistoryReplace effect", () => {
  it("should update location and state, and not increment history length", () => {
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

  it("should call history.replaceState with correct params", () => {
    history.replaceState = jest.fn()
    const historyReplace = HistoryReplace({
      state: {},
      title: "new title",
      url: "#foo"
    })
    runFx(historyReplace)
    expect(history.replaceState).toHaveBeenCalledWith({}, "new title", "#foo")
  })

  it("should call history.replaceState with default title and url", () => {
    history.replaceState = jest.fn()
    document.title = "another title"
    location.href = "http://localhost/#bar"
    const historyReplace = HistoryReplace({
      state: {}
    })
    runFx(historyReplace)
    expect(history.replaceState).toHaveBeenCalledWith(
      {},
      "another title",
      "http://localhost/#bar"
    )
  })
})
