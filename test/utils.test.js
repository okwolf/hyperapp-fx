import { difference } from "../src/utils"

describe("Util for", () => {
  describe("set difference", () => {
    it("should be a function", () =>
      expect(difference).toBeInstanceOf(Function))
    it("should return no difference for empty arrays", () =>
      expect(difference([], [])).toEqual([]))
    it("should return no difference for equal arrays", () =>
      expect(difference(["foo"], ["foo"])).toEqual([]))
    it("should return difference for unequal single element arrays", () =>
      expect(difference(["foo"], ["bar"])).toEqual(["foo"]))
    it("should return difference for unequal multi element arrays", () =>
      expect(difference(["foo", "bar"], ["bar", "baz"])).toEqual(["foo"]))
  })
})
