import { runFx } from "../utils"
import { Alert } from "../../src"

describe("Alert effect", () => {
  it("should display an alert with the specified message", () => {
    const defaultAlert = window.alert
    try {
      const testMessage = "Hello, world!"
      window.alert = jest.fn()
      const alertFx = Alert(testMessage)
      runFx(alertFx)
      expect(window.alert).toBeCalledWith(testMessage)
    } finally {
      window.alert = defaultAlert
    }
  })
})
