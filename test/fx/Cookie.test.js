import { runFx } from "../utils"
import { ReadCookie, WriteCookie, DeleteCookie } from "../../src"

describe("Cookie effect", () => {
  beforeEach(() => {
    document.cookie.split("; ").forEach(c => {
      let cookie = c.substr(0, c.indexOf("="))
      document.cookie = `${cookie}=; expires=${new Date(
        1970,
        0,
        1
      ).toUTCString()}`
    })
  })

  describe("for reading cookies", () => {
    it("should read a cookie", () => {
      document.cookie = "a=cookie"

      const action = jest.fn()
      const readCookie = ReadCookie({ action, name: "a" })
      const { dispatch } = runFx(readCookie)

      expect(dispatch).toBeCalledWith(action, { value: "cookie" })
    })

    it("should handle missing cookies", () => {
      const action = jest.fn()
      const readCookie = ReadCookie({ action, name: "missing" })
      const { dispatch } = runFx(readCookie)

      expect(dispatch).not.toHaveBeenCalled()
    })

    it("should handle names containing reserved characters", () => {
      document.cookie = "a%3Db=cookie"

      const action = jest.fn()
      const readCookie = ReadCookie({ action, name: "a=b" })
      const { dispatch } = runFx(readCookie)

      expect(dispatch).toBeCalledWith(action, { value: "cookie" })
    })

    it("should handle values contains reserved characters", () => {
      document.cookie = "a=b%3Bc"

      const action = jest.fn()
      const readCookie = ReadCookie({ action, name: "a" })
      const { dispatch } = runFx(readCookie)

      expect(dispatch).toBeCalledWith(action, { value: "b;c" })
    })

    it("should handle multiple cookies", () => {
      document.cookie = "a=cookie"
      document.cookie = "b=another%20cookie"

      const action = jest.fn()
      const readCookie = ReadCookie({ action, name: "b" })
      const { dispatch } = runFx(readCookie)

      expect(dispatch).toBeCalledWith(action, { value: "another cookie" })
    })
  })

  describe("for writing cookies", () => {
    it("should be able to write a cookie", () => {
      const writeCookie = WriteCookie({ name: "a", value: "new cookie" })
      runFx(writeCookie)

      expect(document.cookie).toEqual("a=new%20cookie")
    })

    it("should handle names contains reserved characters", () => {
      const writeCookie = WriteCookie({ name: "a=b", value: "new cookie" })
      runFx(writeCookie)

      expect(document.cookie).toEqual("a%3Db=new%20cookie")
    })

    it("should handle values containing reserved characters", () => {
      const writeCookie = WriteCookie({ name: "a", value: "new; cookie" })
      runFx(writeCookie)

      expect(document.cookie).toEqual("a=new%3B%20cookie")
    })
  })

  it("should be able to write a json object to a cookie", () => {
    const writeCookie = WriteCookie({
      name: "a",
      value: { an: "object" },
      json: true
    })
    runFx(writeCookie)

    expect(document.cookie).toEqual("a={%22an%22:%22object%22}")
  })

  it("should be able to read a json object from a cookie", () => {
    document.cookie = "a={%22an%22:%22object%22}"

    const action = jest.fn()
    const readCookie = ReadCookie({ action, name: "a", json: true })
    const { dispatch } = runFx(readCookie)

    expect(dispatch).toBeCalledWith(action, { value: { an: "object" } })
  })

  it("should be able to delete a cookie", () => {
    document.cookie = "a=b"
    expect(document.cookie).toEqual("a=b")

    const deleteCookie = DeleteCookie({ name: "a" })
    runFx(deleteCookie)

    expect(document.cookie).toEqual("")
  })
})
