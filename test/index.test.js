import { h, app } from "hyperapp"
import {
  withEffects,
  action,
  frame,
  delay,
  time,
  log,
  http,
  event,
  keydown,
  keyup,
  random,
  effectsIf
} from "../src"

test("without actions", done =>
  withEffects(app)(undefined, undefined, () => done()))

test("doesn't interfere with non effect actions", done => {
  const actions = withEffects(app)(
    {
      value: 0
    },
    {
      get: () => state => state,
      up: by => state => ({
        value: state.value + by
      }),
      finish: () => (state, actions) => {
        actions.exit()
      },
      exit: () => {
        done()
      }
    }
  )

  expect(actions.get()).toEqual({
    value: 0
  })

  expect(actions.up(2)).toEqual({
    value: 2
  })

  expect(actions.get()).toEqual({
    value: 2
  })

  actions.finish()
})

test("fire a chained action", done =>
  withEffects(app)(
    {},
    {
      foo: () => action("bar", { some: "data" }),
      bar: data => {
        expect(data).toEqual({ some: "data" })
        done()
      }
    }
  ).foo())

test("fire a slice action", done =>
  withEffects(app)(
    {},
    {
      foo: () => action("bar.baz", { some: "data" }),
      bar: {
        baz: data => {
          expect(data).toEqual({ some: "data" })
          done()
        }
      }
    }
  ).foo())

test("state updates with action effects", done =>
  withEffects(app)(
    {},
    {
      update: data => data,
      foo: () => [
        action("update", { key: "value" }),
        action("bar", { some: "data" }),
        action("update", { some: "other value" }),
        action("baz", { moar: "stuff" })
      ],
      bar: data => state => {
        expect(state).toEqual({
          key: "value"
        })
        expect(data).toEqual({ some: "data" })
      },
      baz: data => state => {
        expect(state).toEqual({
          key: "value",
          some: "other value"
        })
        expect(data).toEqual({ moar: "stuff" })
        done()
      }
    }
  ).foo())

test("calls animation frame", done => {
  const timestamp = 9001
  global.requestAnimationFrame = jest.fn(cb => cb(timestamp))
  const actions = withEffects(app)(
    {},
    {
      foo: () => frame("bar.baz"),
      bar: {
        baz: data => {
          expect(data).toBe(timestamp)
          done()
        }
      }
    }
  )
  actions.foo()
  expect(requestAnimationFrame).toBeCalledWith(expect.any(Function))
  delete global.requestAnimationFrame
})

test("fire an action after a delay", () => {
  jest.useFakeTimers()
  try {
    const actions = withEffects(app)(
      {},
      {
        get: () => state => state,
        foo: () => delay(1000, "bar.baz", { updated: "data" }),
        bar: {
          baz: data => data
        }
      }
    )
    actions.foo()
    expect(actions.get()).toEqual({ bar: {} })
    jest.runAllTimers()
    expect(actions.get()).toEqual({ bar: { updated: "data" } })
  } finally {
    jest.useRealTimers()
  }
  
  
})

test("get the current time", done => {
  const timestamp = 9001
  global.performance = {
    now: () => timestamp
  }
  withEffects(app)(
    {},
    {
      foo: () => time("bar.baz"),
      bar: {
        baz: data => {
          expect(data).toBe(timestamp)
          done()
        }
      }
    }
  ).foo()
  delete global.performance
})

test("log to console", done => {
  const testArgs = ["bar", { some: "data" }, ["list", "of", "data"]]
  const defaultLog = console.log
  console.log = function(...args) {
    expect(args).toEqual(testArgs)
    done()
  }
  withEffects(app)(
    {},
    {
      foo: () => log(...testArgs)
    }
  ).foo()
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
  withEffects(app)(
    {},
    {
      foo: () => http(testUrl, "bar.baz"),
      bar: {
        baz: data => {
          expect(data).toEqual({
            response: "data"
          })
          done()
        }
      }
    }
  ).foo()
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
  withEffects(app)(
    {},
    {
      foo: () => http(testUrl, "bar.baz", { response: "text" }),
      bar: {
        baz: data => {
          expect(data).toBe("hello world")
          done()
        }
      }
    }
  ).foo()
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
  withEffects(app)(
    {},
    {
      foo: () =>
        http(testUrl, "bar.baz", {
          method: "POST",
          body: { user: "username", pass: "password" }
        }),
      bar: {
        baz: data => {
          expect(data).toEqual({ result: "authenticated" })
          done()
        }
      }
    }
  ).foo()
  delete global.fetch
})

test("action effects in view", done => {
  document.body.innerHTML = ""
  withEffects(app)(
    {
      message: "hello"
    },
    {
      foo: data => {
        expect(data).toEqual({ some: "data" })
        done()
      }
    },
    ({ message }, actions) =>
      h(
        "main",
        {
          oncreate: () => {
            expect(actions).toEqual({
              foo: expect.any(Function)
            })
            expect(document.body.innerHTML).toBe(
              "<main><h1>hello</h1><button></button></main>"
            )
            const buttonElement = document.body.firstChild.lastChild
            buttonElement.onclick({ button: 0 })
          }
        },
        h("h1", {}, message),
        h("button", { onclick: action("foo", { some: "data" }) })
      ),
    document.body
  )
})

test("event effects in view", done => {
  document.body.innerHTML = ""
  withEffects(app)(
    {
      message: "hello"
    },
    {
      foo(data) {
        expect(data).toEqual({ button: 0 })
        done()
      }
    },
    ({ message }, actions) =>
      h(
        "main",
        {
          oncreate: () => {
            expect(actions).toEqual({
              foo: expect.any(Function)
            })
            expect(document.body.innerHTML).toBe(
              "<main><h1>hello</h1><button></button></main>"
            )
            const buttonElement = document.body.firstChild.lastChild
            buttonElement.onclick({ button: 0 })
          }
        },
        h("h1", {}, message),
        h("button", { onclick: event("foo") })
      ),
    document.body
  )
})

test("combined action and event effects in view", done => {
  document.body.innerHTML = ""
  withEffects(app)(
    {
      message: "hello"
    },
    {
      foo: data => {
        expect(data).toEqual({ button: 0 })
      },
      bar: data => {
        expect(data).toEqual({ some: "data" })
        done()
      }
    },
    ({ message }, actions) =>
      h(
        "main",
        {
          oncreate: () => {
            expect(actions).toEqual({
              foo: expect.any(Function),
              bar: expect.any(Function)
            })
            expect(document.body.innerHTML).toBe(
              "<main><h1>hello</h1><button></button></main>"
            )
            const buttonElement = document.body.firstChild.lastChild
            buttonElement.onclick({ button: 0 })
          }
        },
        h("h1", {}, message),
        h("button", {
          onclick: [event("foo"), action("bar", { some: "data" })]
        })
      ),
    document.body
  )
})

test("keydown", done => {
  const keyEvent = { key: "a", code: "KeyA" }
  withEffects(app)(
    {},
    {
      init: () => keydown("foo"),
      foo: data => {
        expect(data).toEqual(keyEvent)
        done()
      }
    }
  ).init()
  document.onkeydown(keyEvent)
})

test("keyup", done => {
  const keyEvent = { key: "a", code: "KeyA" }
  withEffects(app)(
    {},
    {
      init: () => keyup("foo"),
      foo: data => {
        expect(data).toEqual(keyEvent)
        done()
      }
    }
  ).init()
  document.onkeyup(keyEvent)
})

test("random with default range", done => {
  const randomValue = 0.5
  const defaultRandom = Math.random
  Math.random = () => randomValue

  withEffects(app)(
    {},
    {
      foo: () => random("bar"),
      bar: data => {
        expect(data).toBeCloseTo(randomValue)
        done()
      }
    }
  ).foo()

  Math.random = defaultRandom
})

test("random with custom range", done => {
  const defaultRandom = Math.random
  Math.random = () => 0.5

  withEffects(app)(
    {},
    {
      foo: () => random("bar", 2, 5),
      bar: data => {
        expect(data).toBeCloseTo(3.5)
        done()
      }
    }
  ).foo()

  Math.random = defaultRandom
})

test("effectsIf", () =>
  expect(
    effectsIf([[true, action("include")], [false, action("exclude")]])
  ).toEqual([action("include")]))
