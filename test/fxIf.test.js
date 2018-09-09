import { fxIf, delay } from "../src"
import { omit } from "../src/utils"

describe("fxIf", () => {
  it("should filter out effects with truthy conditionals", () => {
    const include = () => ({})
    const exclude = () => ({})
    expect(
      fxIf([
        [true, omit(delay(1000, include), [""])],
        [false, delay(1000, exclude)]
      ])
    ).toEqual([omit(delay(1000, include), [""])])
  })
})
