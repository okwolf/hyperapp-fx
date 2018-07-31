import { runFx } from "../utils"
import { Http } from "../../src"

describe("Http effect", () => {
  it("should get json", done => {
    const testUrl = "https://example.com"
    global.fetch = (url, options) => {
      expect(url).toBe(testUrl)
      expect(options).toEqual({})
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ response: "data" })
      })
    }

    const action = jest.fn()
    const httpFx = Http({ url: testUrl, action })
    const { dispatch } = runFx(httpFx)

    process.nextTick(() => {
      expect(dispatch).toBeCalledWith(action, { response: "data" })
      delete global.fetch
      done()
    })
  })
  it("should get text", done => {
    const testUrl = "https://example.com/hello"
    global.fetch = (url, options) => {
      expect(url).toBe(testUrl)
      expect(options).toEqual({})
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve("hello world")
      })
    }
    const action = jest.fn()
    const httpFx = Http({ url: testUrl, response: "text", action })
    const { dispatch } = runFx(httpFx)

    process.nextTick(() => {
      expect(dispatch).toBeCalledWith(action, "hello world")
      delete global.fetch
      done()
    })
  })
  it("should post json", done => {
    const testUrl = "/login"
    global.fetch = (url, options) => {
      expect(url).toBe(testUrl)
      expect(options).toEqual({
        method: "POST",
        body: {
          user: "username",
          pass: "password"
        }
      })
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ result: "authenticated" })
      })
    }
    const action = jest.fn()
    const httpFx = Http({
      url: testUrl,
      options: {
        method: "POST",
        body: { user: "username", pass: "password" }
      },
      action
    })
    const { dispatch } = runFx(httpFx)

    process.nextTick(() => {
      expect(dispatch).toBeCalledWith(action, { result: "authenticated" })
      delete global.fetch
      done()
    })
  })
  it("should call the error handler on error", done => {
    const testUrl = "https://example.com/hello"
    const error = new Error("Failed")
    global.fetch = (url, options) => {
      expect(url).toBe(testUrl)
      expect(options).toEqual({})
      return Promise.reject(error)
    }

    const successAction = jest.fn()
    const errorAction = jest.fn()
    const httpFx = Http({
      url: testUrl,
      response: "text",
      action: successAction,
      error: errorAction
    })
    const { dispatch } = runFx(httpFx)

    process.nextTick(() => {
      expect(dispatch).toBeCalledWith(errorAction, error)
      delete global.fetch
      done()
    })
  })
  it("should call default action on error", done => {
    const testUrl = "https://example.com/hello"
    const error = new Error("Failed")
    global.fetch = (url, options) => {
      expect(url).toBe(testUrl)
      expect(options).toEqual({})
      return Promise.reject(error)
    }
    const action = jest.fn()
    const httpFx = Http({ url: testUrl, response: "text", action })
    const { dispatch } = runFx(httpFx)

    process.nextTick(() => {
      expect(dispatch).toBeCalledWith(action, error)
      delete global.fetch
      done()
    })
  })
  it("should call default action on error when response is not OK", done => {
    const testUrl = "https://example.com/hello"
    const response = {
      ok: false
    }
    global.fetch = (url, options) => {
      expect(url).toBe(testUrl)
      expect(options).toEqual({})
      return Promise.resolve(response)
    }
    const action = jest.fn()
    const httpFx = Http({ url: testUrl, response: "text", action })
    const { dispatch } = runFx(httpFx)

    process.nextTick(() => {
      expect(dispatch).toBeCalledWith(action, response)
      delete global.fetch
      done()
    })
  })
})
