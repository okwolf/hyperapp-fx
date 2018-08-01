import { runFx } from "../utils"
import { Merge } from "../../src"

describe("Merge effect", () => {
  it("should shallow merge existing state with new state returned by action", () => {
    const inc = jest.fn(({ count }) => ({ count: count + 1 }))
    const batchFx = Merge(inc)
    const { dispatch } = runFx(batchFx)
    expect(dispatch).toBeCalledWith(expect.any(Function))
    expect(dispatch.mock.calls[0][0]({ count: 0, other: "state" })).toEqual({
      count: 1,
      other: "state"
    })
  })
})
