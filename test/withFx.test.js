import { h, app } from "hyperapp"
import {
  withFx,
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
  debounce,
  throttle
} from "../src"

const dummyView = Function.prototype

beforeEach(() => {
  document.body.innerHTML = ""
})

describe("withFx", () => {
  it("should be a function", () => expect(withFx).toBeInstanceOf(Function))
  it("should call view without actions", done =>
    withFx(app)(undefined, undefined, () => done()))
  it("should not interfere with non fx actions", done => {
    const main = withFx(app)(
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
      },
      dummyView
    )

    expect(main.get()).toEqual({
      value: 0
    })

    expect(main.up(2)).toEqual({
      value: 2
    })

    expect(main.get()).toEqual({
      value: 2
    })

    main.finish()
  })
  it("should handle empty fx", () =>
    withFx(app)({}, { foo: () => [] }, dummyView).foo())
  it("should throw for unknown fx", () =>
    expect(() =>
      withFx(app)(
        {},
        {
          foo: () => ["unknown"]
        },
        dummyView
      ).foo()
    ).toThrow("no such fx type: unknown"))
  describe("built-in fx", () => {
    describe("action", () => {
      it("should throw for unknown actions", () =>
        expect(() =>
          withFx(app)(
            {},
            {
              foo: () => action("unknown")
            },
            dummyView
          ).foo()
        ).toThrow("couldn't find action: unknown"))
      it("should throw for unknown slice actions", () =>
        expect(() =>
          withFx(app)(
            {},
            {
              foo: () => action("uh.oh")
            },
            dummyView
          ).foo()
        ).toThrow("couldn't find action: uh.oh"))
      it("should fire a chained action", done =>
        withFx(app)(
          {},
          {
            foo: () => action("bar", { some: "data" }),
            bar: data => {
              expect(data).toEqual({ some: "data" })
              done()
            }
          },
          dummyView
        ).foo())
      it("should fire a slice action", done =>
        withFx(app)(
          {},
          {
            foo: () => action("bar.baz", { some: "data" }),
            bar: {
              baz: data => {
                expect(data).toEqual({ some: "data" })
                done()
              }
            }
          },
          dummyView
        ).foo())
      it("should update state", done =>
        withFx(app)(
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
          },
          dummyView
        ).foo())
      it("should attach to lifecycle events in view", done => {
        withFx(app)(
          {},
          {
            foo: data => {
              expect(data).toEqual({ some: "data" })
              done()
            }
          },
          () =>
            h("main", {
              oncreate: action("foo", { some: "data" })
            }),
          document.body
        )
      })
      it("should attach to listeners in view", done => {
        withFx(app)(
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
    })
    describe("frame", () => {
      it("should call animation frame", done => {
        const timestamp = 9001
        global.requestAnimationFrame = jest.fn(cb => cb(timestamp))
        const main = withFx(app)(
          {},
          {
            foo: () => frame("bar.baz"),
            bar: {
              baz: data => {
                expect(data).toBe(timestamp)
                done()
              }
            }
          },
          dummyView
        )
        main.foo()
        expect(requestAnimationFrame).toBeCalledWith(expect.any(Function))
        delete global.requestAnimationFrame
      })
    })
    describe("delay", () => {
      it("should fire an action after a delay", () => {
        jest.useFakeTimers()
        try {
          const main = withFx(app)(
            {},
            {
              get: () => state => state,
              foo: () => delay(1000, "bar.baz", { updated: "data" }),
              bar: {
                baz: data => data
              }
            },
            dummyView
          )
          main.foo()
          expect(main.get()).toEqual({ bar: {} })
          jest.runAllTimers()
          expect(main.get()).toEqual({ bar: { updated: "data" } })
        } finally {
          jest.useRealTimers()
        }
      })
    })
    describe("time", () => {
      it("should get the current time", done => {
        const timestamp = 9001
        global.performance.now = () => timestamp
        withFx(app)(
          {},
          {
            foo: () => time("bar.baz"),
            bar: {
              baz: data => {
                expect(data).toBe(timestamp)
                done()
              }
            }
          },
          dummyView
        ).foo()
        delete global.performance.now
      })
    })
    /* eslint-disable no-console */
    describe("log", () => {
      it("should log to console", done => {
        const testArgs = ["bar", { some: "data" }, ["list", "of", "data"]]
        const defaultLog = console.log
        console.log = function(...args) {
          expect(args).toEqual(testArgs)
          done()
        }
        withFx(app)(
          {},
          {
            foo: () => log(...testArgs)
          },
          dummyView
        ).foo()
        console.log = defaultLog
      })
    })
    /* eslint-enable no-console */
    describe("http", () => {
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
        withFx(app)(
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
          },
          dummyView
        ).foo()
        delete global.fetch
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
        withFx(app)(
          {},
          {
            foo: () => http(testUrl, "bar.baz", { response: "text" }),
            bar: {
              baz: data => {
                expect(data).toBe("hello world")
                done()
              }
            }
          },
          dummyView
        ).foo()
        delete global.fetch
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
        withFx(app)(
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
          },
          dummyView
        ).foo()
        delete global.fetch
      })
      it("should call the error handler on error", done => {
        const testUrl = "https://example.com/hello"
        const error = new Error("Failed")
        global.fetch = (url, options) => {
          expect(url).toBe(testUrl)
          expect(options).toEqual({})
          return Promise.reject(error)
        }
        withFx(app)(
          {},
          {
            foo: () =>
              http(testUrl, "bar.baz", {
                response: "text",
                error: "fizz.errorHandler"
              }),
            fizz: {
              errorHandler: err => {
                expect(err).toBe(error)
                done()
              }
            },
            bar: {
              baz: () => {
                done.fail(new Error("Should not be called"))
              }
            }
          },
          dummyView
        ).foo()
        delete global.fetch
      })
      it("should call default action on error", done => {
        const testUrl = "https://example.com/hello"
        const error = new Error("Failed")
        global.fetch = (url, options) => {
          expect(url).toBe(testUrl)
          expect(options).toEqual({})
          return Promise.reject(error)
        }
        withFx(app)(
          {},
          {
            foo: () => http(testUrl, "bar.baz", { response: "text" }),

            bar: {
              baz: data => {
                expect(data).toBe(error)
                done()
              }
            }
          },
          dummyView
        ).foo()
        delete global.fetch
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
        withFx(app)(
          {},
          {
            foo: () => http(testUrl, "bar.baz", { response: "text" }),

            bar: {
              baz: data => {
                expect(data).toBe(response)
                done()
              }
            }
          },
          dummyView
        ).foo()
        delete global.fetch
      })
    })
    describe("event", () => {
      it("should attach to lifecycle events in view", done => {
        withFx(app)(
          {},
          {
            foo(element) {
              expect(element.outerHTML).toBe("<main></main>")
              done()
            }
          },
          () =>
            h("main", {
              oncreate: event("foo")
            }),
          document.body
        )
      })
      it("should attach to listeners in view", done => {
        withFx(app)(
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
    })
    describe("keydown", () => {
      it("should attach keydown listener", done => {
        const keyEvent = { key: "a", code: "KeyA" }
        withFx(app)(
          {},
          {
            init: () => keydown("foo"),
            foo: data => {
              expect(data).toEqual(keyEvent)
              done()
            }
          },
          dummyView
        ).init()
        document.onkeydown(keyEvent)
      })
    })
    describe("keyup", () => {
      it("should attach keyup listener", done => {
        const keyEvent = { key: "a", code: "KeyA" }
        withFx(app)(
          {},
          {
            init: () => keyup("foo"),
            foo: data => {
              expect(data).toEqual(keyEvent)
              done()
            }
          },
          dummyView
        ).init()
        document.onkeyup(keyEvent)
      })
    })
    describe("random", () => {
      it("should call random with default range", done => {
        const randomValue = 0.5
        const defaultRandom = Math.random
        Math.random = () => randomValue

        withFx(app)(
          {},
          {
            foo: () => random("bar"),
            bar: data => {
              expect(data).toBeCloseTo(randomValue)
              done()
            }
          },
          dummyView
        ).foo()

        Math.random = defaultRandom
      })

      it("should call random with custom range", done => {
        const defaultRandom = Math.random
        Math.random = () => 0.5

        withFx(app)(
          {},
          {
            foo: () => random("bar", 2, 5),
            bar: data => {
              expect(data).toBeCloseTo(3.5)
              done()
            }
          },
          dummyView
        ).foo()

        Math.random = defaultRandom
      })
    })
    describe("debounce", () => {
      it("should fire an action after a delay", () => {
        jest.useFakeTimers()
        try {
          const main = withFx(app)(
            {},
            {
              get: () => state => state,
              foo: () => debounce(1000, "bar.baz", { updated: "data" }),
              bar: {
                baz: data => data
              }
            },
            dummyView
          )
          main.foo()
          expect(main.get()).toEqual({ bar: {} })
          jest.runAllTimers()
          expect(main.get()).toEqual({ bar: { updated: "data" } })
        } finally {
          jest.useRealTimers()
        }
      })
      it("should not execute an action until the delay has passed", () => {
        jest.useFakeTimers()
        try {
          const main = withFx(app)(
            {},
            {
              get: () => state => state,
              foo: data => debounce(1000, "bar.baz", data),
              bar: {
                baz: data => data
              }
            },
            dummyView
          )
          jest.spyOn(main.bar, "baz")
          main.foo({ data: "updated" })
          expect(main.bar.baz).toHaveBeenCalledTimes(0)
          expect(main.get()).toEqual({ bar: {} })
          jest.runAllTimers()
          expect(main.bar.baz).toHaveBeenCalledTimes(1)
          expect(main.get()).toEqual({ bar: { data: "updated" } })
        } finally {
          jest.useRealTimers()
        }
      })
      it("should receive the data of the last attempted action call", () => {
        jest.useFakeTimers()
        try {
          const main = withFx(app)(
            {},
            {
              get: () => state => state,
              foo: data => debounce(1000, "bar.baz", data),
              bar: {
                baz: data => data
              }
            },
            dummyView
          )
          jest.spyOn(main.bar, "baz")
          main.foo({ data: "first" })
          main.foo({ data: "last" })
          jest.runAllTimers()
          expect(main.get()).toEqual({ bar: { data: "last" } })
        } finally {
          jest.useRealTimers()
        }
      })
    })
    describe("throttle", () => {
      it("should execute an action within a limit", () => {
        jest.useFakeTimers()
        try {
          const main = withFx(app)(
            {},
            {
              get: () => state => state,
              foo: () => throttle(1000, "bar.baz", { updated: "data" }),
              bar: {
                baz: data => data
              }
            },
            dummyView
          )
          main.foo()
          expect(main.get()).toEqual({ bar: { updated: "data" } })
          jest.runAllTimers()
        } finally {
          jest.useRealTimers()
        }
      })
      it("should only execute an action once within a limit", () => {
        jest.useFakeTimers()
        try {
          const main = withFx(app)(
            {},
            {
              get: () => state => state,
              foo: () => throttle(1000, "bar.baz", { updated: "data" }),
              bar: {
                baz: data => data
              }
            },
            dummyView
          )
          jest.spyOn(main.bar, "baz")
          main.foo({ updated: "data" })
          main.foo({ updated: "again" })
          expect(main.bar.baz).toHaveBeenCalledTimes(1)
          expect(main.get()).toEqual({ bar: { updated: "data" } })
          jest.runAllTimers()
          expect(main.bar.baz).toHaveBeenCalledTimes(1)
          expect(main.get()).toEqual({ bar: { updated: "data" } })
        } finally {
          jest.useRealTimers()
        }
      })
    })
    it("should allow combining fx in view", done => {
      withFx(app)(
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
  })
  describe("custom fx", () => {
    it("should allow adding new custom effect", () => {
      const externalState = { value: 2 }

      const main = withFx({
        set(props, getAction) {
          getAction(props.action)(externalState)
        }
      })(app)(
        {
          value: 0
        },
        {
          foo: () => ["set", { action: "set" }],
          set: state => state,
          get: () => state => state
        },
        dummyView
      )

      expect(main.get()).toEqual({
        value: 0
      })

      main.foo()
      expect(main.get()).toEqual({
        value: 2
      })

      externalState.value = 1

      main.foo()
      expect(main.get()).toEqual({
        value: 1
      })
    })
    it("should allow overriding built-in fx", () => {
      const actionLog = []

      withFx({
        action(props) {
          actionLog.push(props)
        }
      })(app)(
        {},
        {
          foo: () => action("bar", { some: "data" }),
          bar: () => {
            throw new Error(
              "expected bar not to be called with overridden action effect!"
            )
          }
        },
        dummyView
      ).foo()

      expect(actionLog).toEqual([
        {
          name: "bar",
          event: null,
          data: {
            some: "data"
          }
        }
      ])
    })
    it("should attach to lifecycle events in view", done => {
      withFx({
        yolo(props) {
          props.event.innerHTML = "#YOLO"
          expect(document.body.innerHTML).toBe("<main>#YOLO</main>")
          done()
        }
      })(app)(
        {},
        {},
        () =>
          h("main", {
            oncreate: ["yolo", {}]
          }),
        document.body
      )
    })
  })
})
