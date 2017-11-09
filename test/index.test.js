import { app } from "hyperapp"
import {
  withEffects,
  action,
  update,
  frame,
  delay,
  time,
  log,
  http
} from "../src"

test("fire a chained action", done =>
  withEffects(app)({
    actions: {
      foo: () => action("bar", { some: "data" }),
      bar: () => data => {
        expect(data).toEqual({ some: "data" })
        done()
      }
    }
  }).foo())

test("update with effects", () => {
  const actions = withEffects(app)({
    actions: {
      get: state => state,
      foo: () => [update({ key: "value" }), update({ some: "other value" })]
    }
  })
  actions.foo()
  expect(actions.get()).toEqual({
    key: "value",
    some: "other value"
  })
})

test("mix action and update effects", done =>
  withEffects(app)({
    actions: {
      foo: () => [
        update({ key: "value" }),
        action("bar", { some: "data" }),
        update({ some: "other value" }),
        action("baz", { moar: "stuff" })
      ],
      bar: state => data => {
        expect(state).toEqual({
          key: "value"
        })
        expect(data).toEqual({ some: "data" })
      },
      baz: state => data => {
        expect(state).toEqual({
          key: "value",
          some: "other value"
        })
        expect(data).toEqual({ moar: "stuff" })
        done()
      }
    }
  }).foo())

test("calls animation frame", done => {
  const timestamp = 9001
  global.requestAnimationFrame = jest.fn(cb => cb(timestamp))
  const actions = withEffects(app)({
    actions: {
      foo: () => frame("bar", { frame: "data" }),
      bar: () => data => {
        expect(data).toEqual({ time: timestamp, frame: "data" })
        done()
      }
    }
  })
  actions.foo()
  expect(requestAnimationFrame).toBeCalledWith(expect.any(Function))
  delete global.requestAnimationFrame
})

test("fire an action after a delay", () => {
  jest.useFakeTimers()
  const actions = withEffects(app)({
    actions: {
      get: state => state,
      foo: () => delay(1000, "bar", { updated: "data" }),
      bar: () => data => data
    }
  })
  actions.foo()
  expect(actions.get()).toEqual({})
  jest.runAllTimers()
  expect(actions.get()).toEqual({ updated: "data" })
  jest.useRealTimers()
})

test("get the current time", done => {
  const timestamp = 9001
  global.performance = {
    now: () => timestamp
  }
  withEffects(app)({
    actions: {
      foo: () => time("bar", { some: "data" }),
      bar: () => data => {
        expect(data).toEqual({
          time: timestamp,
          some: "data"
        })
        done()
      }
    }
  }).foo()
  delete global.performance
})

test("log to console", done => {
  const defaultLog = console.log
  console.log = function(...args) {
    expect(args).toEqual(["bar", { some: "data" }, ["list", "of", "data"]])
    done()
  }
  withEffects(app)({
    actions: {
      foo: () => log("bar", { some: "data" }, ["list", "of", "data"])
    }
  }).foo()
  console.log = defaultLog
})

test("http get json", done => {
  const testUrl = "https://example.com"
  global.fetch = (url, options) => {
    expect(url).toBe(testUrl)
    expect(options).toEqual({
      response: "json"
    })
    return Promise.resolve({
      json: () => Promise.resolve({ response: "data" })
    })
  }
  withEffects(app)({
    actions: {
      foo: () => http(testUrl, "bar"),
      bar: () => data => {
        expect(data).toEqual({
          response: "data"
        })
        done()
      }
    }
  }).foo()
  delete global.fetch
})

test("http get text", done => {
  const testUrl = "https://example.com/hello"
  global.fetch = (url, options) => {
    expect(url).toBe(testUrl)
    expect(options).toEqual({
      response: "text"
    })
    return Promise.resolve({
      text: () => Promise.resolve("hello world")
    })
  }
  withEffects(app)({
    actions: {
      foo: () => http(testUrl, "bar", { response: "text" }),
      bar: () => data => {
        expect(data).toBe("hello world")
        done()
      }
    }
  }).foo()
  delete global.fetch
})

test("http post json", done => {
  const testUrl = "/login"
  global.fetch = (url, options) => {
    expect(url).toBe(testUrl)
    expect(options).toEqual({
      method: "POST",
      body: {
        user: "username",
        pass: "password"
      },
      response: "json"
    })
    return Promise.resolve({
      json: () => Promise.resolve({ result: "authenticated" })
    })
  }
  withEffects(app)({
    actions: {
      foo: () =>
        http(testUrl, "bar", {
          method: "POST",
          body: { user: "username", pass: "password" }
        }),
      bar: () => data => {
        expect(data).toEqual({ result: "authenticated" })
        done()
      }
    }
  }).foo()
  delete global.fetch
})
