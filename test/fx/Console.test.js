import { runFx } from "../utils"
import { Console } from "../../src"

/* eslint-disable no-console */
describe("Console effect", () => {
  it("should log to console", () => {
    const defaultLog = console.log
    try {
      const testArgs = ["bar", { some: "data" }, ["list", "of", "data"]]
      console.log = jest.fn()
      const consoleFx = Console(...testArgs)
      runFx(consoleFx)
      expect(console.log).toBeCalledWith(...testArgs)
    } finally {
      console.log = defaultLog
    }
  })
})
/* eslint-enable no-console */
