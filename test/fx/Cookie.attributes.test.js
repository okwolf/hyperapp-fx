import { runFx } from "../utils"
import { WriteCookie } from "../../src/fx/cookie"

describe("Cookie effect", () => {
  describe("Should be able to set cookie attributes", () => {
    beforeEach(() => {
      Object.defineProperty(document, "cookie", {
        value: "",
        writable: true
      })
    })

    it("path", () => {
      const writeCookie = WriteCookie({
        name: "name",
        value: "value",
        path: "/path"
      })
      runFx(writeCookie)

      expect(document.cookie).toEqual("name=value;path=/path")
    })

    it("domain", () => {
      const writeCookie = WriteCookie({
        name: "name",
        value: "value",
        domain: ".domain.com"
      })
      runFx(writeCookie)

      expect(document.cookie).toEqual("name=value;domain=.domain.com")
    })

    it("ttl to expiry date", () => {
      const ttl = 1000
      const now = new Date()
      const expires = new Date(now.getTime() + ttl * 1000)

      const writeCookie = WriteCookie({ name: "name", value: "value", ttl })
      runFx(writeCookie)

      expect(document.cookie).toEqual("name=value;expires=" + expires.toUTCString())
    })

    it("expiry date", () => {
      const now = new Date()
      const expires = new Date(now.getTime() + 1000 * 1000)

      const writeCookie = WriteCookie({
        name: "name",
        value: "value",
        expires: expires
      })
      runFx(writeCookie)

      expect(document.cookie).toEqual("name=value;expires=" + expires.toUTCString())
    })

    it("multiple attributes", () => {
      const writeCookie = WriteCookie({
        name: "name",
        value: "value",
        domain: "domain.com",
        path: "/home"
      })
      runFx(writeCookie)

      expect(document.cookie).toEqual("name=value;path=/home;domain=domain.com")
    })
  })
})
