import { runFx } from "../utils"
import { HistoryPush } from "../../src"

describe("History effect", () => {
  it("pushing to state should update location", () => {
    const historyPush = HistoryPush({
      data: {},
      title: "new title",
      url: "#foo"
    })
    runFx(historyPush)
    expect(location.hash).toEqual("#foo")
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
