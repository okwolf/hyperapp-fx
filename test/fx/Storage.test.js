import { runFx } from "../utils"
import { WriteToStorage, ReadFromStorage } from "../../src"
import { RemoveFromStorage } from "../../src/fx/Storage"

const mockStorage = (store = {}) => {
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(jest.fn())
  jest
    .spyOn(Storage.prototype, "getItem")
    .mockImplementation(key => store[key] || null)
  jest.spyOn(Storage.prototype, "removeItem").mockImplementation(jest.fn())
}

const reverser = s =>
  s
    .split("")
    .reverse()
    .join("")

describe("WriteToStorage effect", () => {
  beforeEach(() => {
    mockStorage()
  })

  it("writes to storage", () => {
    const writeToStorageFx = WriteToStorage({ key: "bar", value: "123" })
    runFx(writeToStorageFx)
    expect(sessionStorage.setItem).toBeCalledWith("bar", '"123"')
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
    mockStorage({ foo: '"bar"', soo: '"cat"' })
  })

  it("reads from storage", () => {
    const action = jest.fn()
    const readFromStorageFx = ReadFromStorage({ key: "soo", action })
    const { dispatch } = runFx(readFromStorageFx)
    expect(dispatch).toBeCalledWith(action, { value: "cat" })
    expect(sessionStorage.getItem).toBeCalledWith("soo")
  })

  it("should call error function on parse error", () => {
    mockStorage({ foo: "rab" })
    const action = jest.fn()
    const readFromStorageFx = ReadFromStorage({ key: "foo", error: action })
    const { dispatch } = runFx(readFromStorageFx)
    expect(dispatch).toBeCalledWith(action)
    expect(sessionStorage.getItem).toBeCalledWith("soo")
  })

  it("can use a custom converter to read", () => {
    mockStorage({ foo: "rab" })
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

describe("DeleteFromStorage effect", () => {
  it("can remove from storage", () => {
    mockStorage({ foo: "bar" })
    const removeFromStorageFx = RemoveFromStorage({ key: "foo" })
    runFx(removeFromStorageFx)
    expect(sessionStorage.removeItem).toBeCalledWith("foo")
  })
})
