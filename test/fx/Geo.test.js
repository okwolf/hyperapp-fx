import { runFx } from "../utils"
import { GetCurrentPosition } from "../../src"

describe("GetCurrentPosition effect", () => {
  it("should return coords on success", () => {
    navigator.geolocation = {
      getCurrentPosition: function(successCallback) {
        successCallback({ coords: { longitude: 42.0, latitude: 42.1 } })
      }
    }
    const action = jest.fn()
    const getCurrentPositionFx = GetCurrentPosition({ action })
    const { dispatch } = runFx(getCurrentPositionFx)
    expect(dispatch).toBeCalledWith(action, {
      coords: { longitude: 42.0, latitude: 42.1 }
    })
  })
  it("should call error handler on error", () => {
    navigator.geolocation = {
      getCurrentPosition: function(successCallback, errorCallback) {
        errorCallback("things went wrong")
      }
    }
    const action = jest.fn()
    const error = jest.fn()
    const getCurrentPositionFx = GetCurrentPosition({ action, error })
    const { dispatch } = runFx(getCurrentPositionFx)
    expect(dispatch).toBeCalledWith(error, "things went wrong")
  })
})
