import { runFx } from "../utils"
import { Random } from "../../src"

describe("Random effect", () => {
  it("should call Math.random with default range", () => {
    const randomValue = 0.5
    const defaultRandom = Math.random
    Math.random = () => randomValue

    const action = jest.fn()
    const randomFx = Random({ action })
    const { dispatch } = runFx(randomFx)
    expect(dispatch).toBeCalledWith(action, randomValue)

    Math.random = defaultRandom
  })

  it("should call Math.random with custom range", () => {
    const defaultRandom = Math.random
    Math.random = () => 0.5

    const action = jest.fn()
    const randomFx = Random({ min: 2, max: 5, action })
    const { dispatch } = runFx(randomFx)
    expect(dispatch).toBeCalledWith(action, 3.5)

    Math.random = defaultRandom
  })
})
