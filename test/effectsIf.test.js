import { action, fxIf } from "../src"

describe("fxIf", () => {
  it("should filter out effects with truthy conditionals", () =>
    expect(
      fxIf([[true, action("include")], [false, action("exclude")]])
    ).toEqual([action("include")]))
})
