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
  random
} from "../dist/fx"

describe("withFx", () => {
  it("should be a function", () => expect(withFx).toBeInstanceOf(Function))
  it("should call view without actions", done =>
    withFx(app)(undefined, undefined, () => done()))
  it("should not interfere with non effect actions", done => {
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
      }
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
  describe("built-in effect", () => {
    describe("action", () => {
      it("should throw for unknown actions", () =>
        expect(() =>
          withFx(app)(
            {},
            {
              foo: () => action("unknown")
            }
          ).foo()
        ).toThrow("couldn't find action: unknown"))
      it("should throw for unknown slice actions", () =>
        expect(() =>
          withFx(app)(
            {},
            {
              foo: () => action("uh.oh")
            }
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
          }
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
          }
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
          }
        ).foo())
      it("should attach to listeners in view", done => {
        document.body.innerHTML = ""
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
          }
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
            Function.prototype
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
        global.performance = {
          now: () => timestamp
        }
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
          }
        ).foo()
        delete global.performance
      })
    })
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
          }
        ).foo()
        console.log = defaultLog
      })
    })
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
          }
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
          }
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
          }
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
              baz: data => {
                done.fail(new Error("Should not be called"))
              }
            }
          }
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
          }
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
          }
        ).foo()
        delete global.fetch
      })
    })
    describe("event", () => {
      it("should attach to listeners in view", done => {
        document.body.innerHTML = ""
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
          }
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
          }
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
          }
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
          }
        ).foo()

        Math.random = defaultRandom
      })
    })
  })
  it("should allow combining action and event fx in view", done => {
    document.body.innerHTML = ""
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
      }
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
      }
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
})
