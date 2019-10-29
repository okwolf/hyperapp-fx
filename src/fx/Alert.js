function alertEffect(dispatch, message) {
  window.alert(message)
}

/**
 * Describes an effect that will call [`window.alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) to display a dialog window with the specified message and an "OK" button which can be clicked to dismiss it.
 *
 * @memberof module:fx
 * @param {*} message - Message to display in the alert dialog. If not a string, will be converted to a string when displayed.
 * @example
 * import { Alert } from "hyperapp-fx"
 *
 * const AlertAction = state => [
 *   state,
 *   Alert("Hello, world!")
 * ]
 */

export function Alert(message) {
  return [alertEffect, message]
}
