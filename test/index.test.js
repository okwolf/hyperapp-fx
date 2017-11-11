import { app } from "hyperapp"
import { withEffects, action, frame, delay, time, log, http } from "../src"

test("without actions", done =>
  withEffects(app)({
    view: () => done()
  }))

test("doesn't interfere with non effect actions", () => {
  const actions = withEffects(app)({
    state: {
      value: 0
    },
    actions: {
      get: state => state,
      up: state => by => ({
        value: state.value + by
      })
    }
  })

  expect(actions.get()).toEqual({
    value: 0
  })

  expect(actions.up(2)).toEqual({
    value: 2
  })

  expect(actions.get()).toEqual({
    value: 2
  })
})

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

test("fire a slice action", done =>
  withEffects(app)({
    actions: {
      foo: () => action("bar.baz", { some: "data" }),
      bar: {
        baz: () => data => {
          expect(data).toEqual({ some: "data" })
          done()
        }
      }
    }
  }).foo())

test("state updates with action effects", done =>
  withEffects(app)({
    actions: {
      update: () => state => state,
      foo: () => [
        action("update", { key: "value" }),
        action("bar", { some: "data" }),
        action("update", { some: "other value" }),
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
      foo: () => frame("bar.baz", { frame: "data" }),
      bar: {
        baz: () => data => {
          expect(data).toEqual({ time: timestamp, frame: "data" })
          done()
        }
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
      foo: () => delay(1000, "bar.baz", { updated: "data" }),
      bar: {
        baz: () => data => data
      }
    }
  })
  actions.foo()
  expect(actions.get()).toEqual({ bar: {} })
  jest.runAllTimers()
  expect(actions.get()).toEqual({ bar: { updated: "data" } })
  jest.useRealTimers()
})

test("get the current time", done => {
  const timestamp = 9001
  global.performance = {
    now: () => timestamp
  }
  withEffects(app)({
    actions: {
      foo: () => time("bar.baz", { some: "data" }),
      bar: {
        baz: () => data => {
          expect(data).toEqual({
            time: timestamp,
            some: "data"
          })
          done()
        }
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
      foo: () => http(testUrl, "bar.baz"),
      bar: {
        baz: () => data => {
          expect(data).toEqual({
            response: "data"
          })
          done()
        }
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
      foo: () => http(testUrl, "bar.baz", { response: "text" }),
      bar: {
        baz: () => data => {
          expect(data).toBe("hello world")
          done()
        }
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
        http(testUrl, "bar.baz", {
          method: "POST",
          body: { user: "username", pass: "password" }
        }),
      bar: {
        baz: () => data => {
          expect(data).toEqual({ result: "authenticated" })
          done()
        }
      }
    }
  }).foo()
  delete global.fetch
})
