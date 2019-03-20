import { runFx } from "../utils"
import { ReadCookie, WriteCookie, DeleteCookie } from "../../src/fx/cookie"

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

  describe("Should be able to read cookies", () => {
    it("read a cookie", () => {
      document.cookie = "a=cookie"

      const action = jest.fn()
      const readCookie = ReadCookie({ action, name: "a" })
      const { dispatch } = runFx(readCookie)

      expect(dispatch).toBeCalledWith(action, { value: "cookie" })
    })

    it("name contains a reserved character", () => {
      document.cookie = "a%3Db=cookie"

      const action = jest.fn()
      const readCookie = ReadCookie({ action, name: "a=b" })
      const { dispatch } = runFx(readCookie)

      expect(dispatch).toBeCalledWith(action, { value: "cookie" })
    })

    it("value contains a reserved character", () => {
      document.cookie = "a=b%3Bc"

      const action = jest.fn()
      const readCookie = ReadCookie({ action, name: "a" })
      const { dispatch } = runFx(readCookie)

      expect(dispatch).toBeCalledWith(action, { value: "b;c" })
    })

    it("multiple cookies are set", () => {
      document.cookie = "a=cookie"
      document.cookie = "b=another%20cookie"

      const action = jest.fn()
      const readCookie = ReadCookie({ action, name: "b" })
      const { dispatch } = runFx(readCookie)

      expect(dispatch).toBeCalledWith(action, { value: "another cookie" })
    })

    it("name contains reserved characters", () => {
      document.cookie = "a=new%3B%20cookie"

      const action = jest.fn()
      const readCookie = ReadCookie({ action, name: "a" })
      const { dispatch } = runFx(readCookie)

      expect(dispatch).toBeCalledWith(action, { value: "new; cookie" })
    })
  })

  describe("Should be able to write cookies", () => {
    it("should be able to write a cookie", () => {
      const writeCookie = WriteCookie({ name: "a", value: "new cookie" })
      runFx(writeCookie)

      expect(document.cookie).toEqual("a=new%20cookie")
    })

    it("name contains a reserved character", () => {
      const writeCookie = WriteCookie({ name: "a=b", value: "new cookie" })
      runFx(writeCookie)

      expect(document.cookie).toEqual("a%3Db=new%20cookie")
    })

    it("value contains reserved characters", () => {
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
