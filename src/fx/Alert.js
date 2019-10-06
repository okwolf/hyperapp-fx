function alertEffect(dispatch, message) {
  window.alert(message)
}

/**
 * Describes an effect that will call [`window.alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) to display a dialog window with the specified message and an "OK" button.
 *
 * @memberof module:fx
 * @param {...*} message - message to display in the alert dialog
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
