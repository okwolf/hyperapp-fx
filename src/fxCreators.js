import { assign, omit } from "./utils.js"
import { INTERNAL_DISPATCH, INTERNAL_COMMAND } from "./constants"

export function makeCommand(props, runFx) {
  var fxData = {
    props: props,
    runFx: runFx
  }
  fxData[INTERNAL_COMMAND] = true
  return fxData
}

export function makeDispatchAction(action, data) {
  var actionData = {}
  actionData[INTERNAL_DISPATCH] = {
    action: action,
    data: data
  }
  return actionData
}

export function delay(duration, action, data) {
  return makeCommand(
    {
      action: action,
      duration: duration,
      data: data
    },
    function(dispatch, props) {
      setTimeout(function() {
        dispatch(makeDispatchAction(props.action, props.data))
      }, props.duration)
    }
  )
}

export function http(url, action, options) {
  return makeCommand(
    {
      url: url,
      action: action,
      options: assign(
        {
          response: "json",
          error: action
        },
        options
      )
    },
    function(dispatch, props) {
      var fetchOptions = omit(props.options, ["response", "error"])
      fetch(props.url, fetchOptions)
        .then(function(response) {
          if (!response.ok) {
            throw response
          }
          return response
        })
        .then(function(response) {
          return response[props.options.response]()
        })
        .then(function(result) {
          dispatch(makeDispatchAction(props.action, result))
        })
        .catch(function(error) {
          dispatch(makeDispatchAction(props.options.error, error))
        })
    }
  )
}
