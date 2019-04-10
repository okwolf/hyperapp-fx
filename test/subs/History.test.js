import { runFx } from "../utils"
import { HistoryPop } from "../../src"

describe("History subscription", () => {
  it("should add and remove popstate listener", () => {
    const action = jest.fn()
    const historyPop = HistoryPop({ action })
    const { dispatch, unsubscribe } = runFx(historyPop)
    const popStateEvent = new PopStateEvent("popstate", {
      state: { foo: "bar" }
    })
    window.dispatchEvent(popStateEvent)
    expect(dispatch).toBeCalledWith(action, popStateEvent)
    unsubscribe()

    dispatch.mockReset()
    document.dispatchEvent(popStateEvent)
    expect(dispatch).not.toBeCalled()
  })
})
