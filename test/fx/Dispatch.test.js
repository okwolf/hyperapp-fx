import { runFx } from "../utils"
import { Dispatch } from "../../src"

describe("Dispatch effect", () => {
  it("should dispatch the action", () => {
    const action = jest.fn()
    const dispatchFx = Dispatch(action)
    const { dispatch } = runFx(dispatchFx)
    expect(dispatch).toBeCalledWith(action)
  })
})
