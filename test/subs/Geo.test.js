import { runFx } from "../utils"
import { WatchPosition } from "../../src"

describe("WatchPosition effect", () => {
  it("should return coords on success", () => {
    navigator.geolocation = {
      watchPosition: function(successCallback) {
        successCallback({ coords: { longitude: 42.0, latitude: 42.1 } })
        return 12
      },
      clearWatch: function(watchId) {
        expect(watchId).toBe(12)
      }
    }
    const action = jest.fn()
    const watchPositionFx = WatchPosition({ action })
    const { dispatch, unsubscribe } = runFx(watchPositionFx)
    expect(dispatch).toBeCalledWith(action, {
      coords: { longitude: 42.0, latitude: 42.1 }
    })
    unsubscribe()
  })
  it("should call error handler on error", () => {
    navigator.geolocation = {
      watchPosition: function(successCallback, errorCallback) {
        errorCallback("things went wrong")
        return 34
      },
      clearWatch: function(watchId) {
        expect(watchId).toBe(34)
      }
    }
    const action = jest.fn()
    const error = jest.fn()
    const watchPositionFx = WatchPosition({ action, error })
    const { dispatch, unsubscribe } = runFx(watchPositionFx)
    expect(dispatch).toBeCalledWith(error, "things went wrong")
    unsubscribe()
  })
})
