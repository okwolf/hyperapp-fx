import { app } from "hyperapp"
import { withEffects, Action, Update, Frame, Delay } from "../src"

test("fire a chained action", done =>
  withEffects(app)({
    actions: {
      foo: () => [Action({ name: "bar", data: { some: "data" } })],
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
      foo: () => [
        Update({ state: { key: "value" } }),
        Update({ state: { some: "other value" } })
      ]
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
        Update({ state: { key: "value" } }),
        Action({ name: "bar", data: { some: "data" } }),
        Update({ state: { some: "other value" } }),
        Action({ name: "baz", data: { moar: "stuff" } })
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
      foo: () => [Frame({ action: "bar", data: { frame: "data" } })],
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
      foo: () => [
        Delay({ duration: 1000, action: "bar", data: { updated: "data" } })
      ],
      bar: () => data => data
    }
  })
  actions.foo()
  expect(actions.get()).toEqual({})
  jest.runAllTimers()
  expect(actions.get()).toEqual({ updated: "data" })
  jest.useRealTimers()
})
