import { runFx } from "../utils"
import { BatchFx } from "../../src"

describe("BatchFx effect", () => {
  it("should dispatch nothing with no fx", () => {
    const batchFx = BatchFx()
    const { dispatch } = runFx(batchFx)
    expect(dispatch).not.toBeCalled()
  })
  it("should dispatch single fx", () => {
    const props = {}
    const effect = jest.fn()
    const batchFx = BatchFx({ props, effect })
    const { dispatch } = runFx(batchFx)
    expect(effect).toBeCalledWith(props, dispatch)
  })
  it("should dispatch multiple fx", () => {
    const props1 = { first: "props" }
    const effect1 = jest.fn()
    const props2 = { second: "props" }
    const effect2 = jest.fn()
    const batchFx = BatchFx(
      { props: props1, effect: effect1 },
      { props: props2, effect: effect2 }
    )
    const { dispatch } = runFx(batchFx)
    expect(effect1).toBeCalledWith(props1, dispatch)
    expect(effect2).toBeCalledWith(props2, dispatch)
  })
})
