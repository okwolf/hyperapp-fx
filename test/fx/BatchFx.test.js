import { runFx } from "../utils"
import { BatchFx } from "../../src"

describe("BatchFx effect", () => {
  it("should dispatch nothing with no fx", () => {
    const batchFx = BatchFx()
    const { dispatch } = runFx(batchFx)
    expect(dispatch).not.toBeCalled()
  })
  it("should dispatch single fx", () => {
    const effect = jest.fn()
    const fx = { key: "value", effect }
    const batchFx = BatchFx(fx)
    const { dispatch } = runFx(batchFx)
    expect(effect).toBeCalledWith(fx, dispatch)
  })
  it("should dispatch multiple fx", () => {
    const props1 = { first: "props" }
    const effect1 = jest.fn()
    const props2 = { second: "props" }
    const effect2 = jest.fn()
    const fx1 = { props: props1, effect: effect1 }
    const fx2 = { props: props2, effect: effect2 }
    const batchFx = BatchFx(fx1, fx2)
    const { dispatch } = runFx(batchFx)
    expect(effect1).toBeCalledWith(fx1, dispatch)
    expect(effect2).toBeCalledWith(fx2, dispatch)
  })
})
