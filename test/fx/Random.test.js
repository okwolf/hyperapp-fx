import { runFx } from "../utils"
import { Random } from "../../src"

describe("Random effect", () => {
  const defaultRandom = Math.random
  afterEach(() => {
    Math.random = defaultRandom
  })
  it("should call Math.random with default range", () => {
    const randomValue = 0.5
    Math.random = () => randomValue

    const action = jest.fn()
    const randomFx = Random({ action })
    const { dispatch } = runFx(randomFx)
    expect(dispatch).toBeCalledWith(action, randomValue)
  })

  it("should call Math.random with custom range", () => {
    Math.random = () => 0.5

    const action = jest.fn()
    const randomFx = Random({ min: 2, max: 5, action })
    const { dispatch } = runFx(randomFx)
    expect(dispatch).toBeCalledWith(action, 3.5)
  })

  it("should generate integers", () => {
    Math.random = () => 0.5

    const action = jest.fn()
    const randomFx = Random({ int: true, min: 1, max: 3, action })
    const { dispatch } = runFx(randomFx)
    expect(dispatch).toBeCalledWith(action, 2)
  })

  it("should generate false booleans", () => {
    Math.random = () => 0.4

    const action = jest.fn()
    const randomFx = Random({ bool: true, action })
    const { dispatch } = runFx(randomFx)
    expect(dispatch).toBeCalledWith(action, false)
  })

  it("should generate true booleans", () => {
    Math.random = () => 0.5

    const action = jest.fn()
    const randomFx = Random({ bool: true, action })
    const { dispatch } = runFx(randomFx)
    expect(dispatch).toBeCalledWith(action, true)
  })

  it("should generate multiple values", () => {
    Math.random = () => 0.5

    const action = jest.fn()
    const randomFx = Random({
      values: [
        {},
        { min: 2, max: 5 },
        { int: true, min: 1, max: 3 },
        { bool: true }
      ],
      action
    })
    const { dispatch } = runFx(randomFx)
    expect(dispatch).toBeCalledWith(action, [0.5, 3.5, 2, true])
  })
})
