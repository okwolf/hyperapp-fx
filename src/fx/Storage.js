import { assign } from "../utils.js"

function storageArea(area) {
  return window[area + "Storage"] || sessionStorage
}

function writeToStorageEffect(props) {
  var value = props.converter(props.value)
  storageArea(props.area).setItem(props.key, value)
}

function readFromStorageEffect(props, dispatch) {
  var value = props.converter(storageArea(props.area).getItem(props.key))
  var dispatchProps = assign({}, props.props || {})
  dispatchProps[props.prop || "value"] = value
  dispatch(props.action, dispatchProps)
}

function removeFromStorageEffect(props) {
  storageArea(props.area).removeItem(props.key)
}

/**
 * Describes an effect that will write a key value pair to Storage. By default the item is written to `sessionStorage`, to write to `localStorage` set the `storage` prop to `local`. Values can be saved as json by specifying `json` as true.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {string} props.key - Specify key to use
 * @param {*} props.value - Value to write to storage
 * @param {string} props.storage - Storage area to write to, can be either "session" or "local"
 * @param {boolean} props.json - Converts the value of the item to JSON
 * @param {function} props.converter - Use a custom converter function to encode the value of the item
 * @example
 * import { WriteToStorage } from "hyperapp-fx"
 *
 * const SavePreferences = (state, preferences) => [
 *   state,
 *   WriteToStorage({
 *     name: "preferences",
 *     value: preferences,
 *     storage: "local"
 *     json: true
 *   })
 * ]
 *
 */

export function WriteToStorage(props) {
  return [
    writeToStorageEffect,
    assign(
      {
        converter:
          props.converter || props.json
            ? JSON.stringify
            : function(v) {
                return v
              }
      },
      props
    )
  ]
}

/**
 * Describes an effect that will read the value of a key from Storage. By default the item is read from `sessionStorage`, to read from `localStorage` set the `storage` prop to `local`. Values can be read as json by specifying `json` as true.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {string} props.key - Specify key to use with which to write to storage
 * @param {*} props.action - Action to call with the value of the item in storage
 * @param {string} props.storage - Storage area to read from, can be either "session" or "local"
 * @param {string} props.prop - Property of the action where the value is received, defaults to "value"
 * @param {boolean} props.json - Convert the value of the item from JSON
 * @param {function} props.converter - Use a custom converter function to decode the value of the item
 * @example
 * import { ReadFromStorage } from "hyperapp-fx"
 *
 * const LoadPreferences = state => [
 *  state,
 *  ReadFromStorage({
 *    key: "preferences",
 *    action: function (state, { value }) {
 *      // this action will receive the value of the item in storage
 *    }
 *  })
 * ]
 *
 */

export function ReadFromStorage(props) {
  return [
    readFromStorageEffect,
    assign(
      {
        converter:
          props.converter || props.json
            ? JSON.parse
            : function(v) {
                return v
              }
      },
      props
    )
  ]
}

/**
 * Describes an effect that will remove a key value pair Storage. By default the item is deleted from `sessionStorage`, to delete from `localStorage` set the `storage` prop to `local`.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {string} props.key - Specify key to use with which to write to storage
 * @param {string} props.storage - Storage area to delete from, can be either "session" or "local"
 * @example
 * import { RemoveFromStorage } from "hyperapp-fx"
 *
 * const ClearPreferences = state => [
 *  state,
 *  RemoveFromStorage({
 *    key: "preferences",
 *    storage: "local"
 *  })
 * ]
 *
 */

export function RemoveFromStorage(props) {
  return [removeFromStorageEffect, props]
}
