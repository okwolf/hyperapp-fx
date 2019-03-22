import { runFx } from "../utils"
import { WriteToStorage, ReadFromStorage } from "../../src"
import { RemoveFromStorage } from "../../src/fx/Storage"

const mockStorage = (store = {}) => {
  return {
    setItem: jest.fn(),
    getItem: jest.fn(key => store[key] || null),
    removeItem: jest.fn()
  }
}

const reverser = s =>
  s
    .split("")
    .reverse()
    .join("")

describe("WriteToStorage effect", () => {
  beforeEach(() => {
    window.localStorage = mockStorage()
    window.sessionStorage = mockStorage()
  })

  it("writes to sessionStorage by default", () => {
    const writeToStorageFx = WriteToStorage({ key: "bar", value: "123" })
    runFx(writeToStorageFx)
    expect(sessionStorage.setItem).toBeCalledWith("bar", "123")
  })

  it("writes to localStorage if asked to do so", () => {
    const writeToStorageFx = WriteToStorage({
      key: "bar",
      value: "123",
      storage: "local"
    })
    runFx(writeToStorageFx)
    expect(localStorage.setItem).toBeCalledWith("bar", "123")
  })

  it("can convert to JSON", () => {
    const writeToStorageFx = WriteToStorage({
      key: "bar",
      value: { foo: "baz" },
      json: true
    })
    runFx(writeToStorageFx)
    expect(sessionStorage.setItem).toBeCalledWith("bar", '{"foo":"baz"}')
  })

  it("can use a custom converter", () => {
    const writeToStorageFx = WriteToStorage({
      key: "bar",
      value: "foo",
      converter: reverser
    })
    runFx(writeToStorageFx)
    expect(sessionStorage.setItem).toBeCalledWith("bar", "oof")
  })
})

describe("ReadFromStorage effect", () => {
  beforeEach(() => {
    window.localStorage = mockStorage({ foo: "bar" })
    window.sessionStorage = mockStorage({ soo: "cat" })
  })

  it("reads from sessionStorage by default", () => {
    const action = jest.fn()
    const readFromStorageFx = ReadFromStorage({ key: "soo", action })
    const { dispatch } = runFx(readFromStorageFx)
    expect(dispatch).toBeCalledWith(action, { value: "cat" })
    expect(sessionStorage.getItem).toBeCalledWith("soo")
  })

  it("reads from localStorage if asked to", () => {
    const action = jest.fn()
    const readFromStorageFx = ReadFromStorage({
      key: "foo",
      action,
      storage: "local"
    })
    const { dispatch } = runFx(readFromStorageFx)
    expect(dispatch).toBeCalledWith(action, { value: "bar" })
    expect(localStorage.getItem).toBeCalledWith("foo")
  })

  it("can convert from JSON", () => {
    window.sessionStorage = mockStorage({ foo: '{"bar":"baz"}' })
    const action = jest.fn()
    const readFromStorageFx = ReadFromStorage({
      key: "foo",
      action,
      json: true
    })
    const { dispatch } = runFx(readFromStorageFx)
    expect(dispatch).toBeCalledWith(action, { value: { bar: "baz" } })
    expect(sessionStorage.getItem).toBeCalledWith("foo")
  })

  it("can use a custom converter to read", () => {
    window.sessionStorage = mockStorage({ foo: "rab" })
    const action = jest.fn()
    const readFromStorageFx = ReadFromStorage({
      key: "foo",
      action,
      converter: reverser
    })
    const { dispatch } = runFx(readFromStorageFx)
    expect(dispatch).toBeCalledWith(action, { value: "bar" })
    expect(sessionStorage.getItem).toBeCalledWith("foo")
  })

  it("can specify which action prop receives the value", () => {
    window.sessionStorage = mockStorage({ foo: "bar" })
    const action = jest.fn()
    const readFromStorageFx = ReadFromStorage({
      key: "foo",
      action,
      prop: "text"
    })
    const { dispatch } = runFx(readFromStorageFx)
    expect(dispatch).toBeCalledWith(action, { text: "bar" })
    expect(sessionStorage.getItem).toBeCalledWith("foo")
  })
})

describe("WriteToStorage effect", () => {
  it("can remove from storage", () => {
    window.sessionStorage = mockStorage({ foo: "bar" })
    const removeFromStorageFx = RemoveFromStorage({ key: "foo" })
    runFx(removeFromStorageFx)
    expect(sessionStorage.removeItem).toBeCalledWith("foo")
  })
})
