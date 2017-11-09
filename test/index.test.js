import { app } from "hyperapp"
import { withEffects, action, update, frame, delay, log } from "../src"

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
  global.requestAnimationFrame = jest.fn(cb => cb())
  const actions = withEffects(app)({
    actions: {
      foo: () => frame("bar", { frame: "data" }),
      bar: () => data => {
        expect(data).toEqual({ frame: "data" })
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

test("log to console", () => {
  const defaultLog = console.log
  console.log = function(...args) {
    expect(args).toEqual(["bar", { some: "data" }, ["list", "of", "data"]])
  }
  withEffects(app)({
    actions: {
      foo: () => log("bar", { some: "data" }, ["list", "of", "data"])
    }
  }).foo()
  console.log = defaultLog
})
