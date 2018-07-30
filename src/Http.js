import { assign, omit } from "./utils.js"

function httpEffect(props, dispatch) {
  var fetchOptions = omit(props, ["url", "action", "response", "error"])
  fetch(props.url, fetchOptions)
    .then(function(response) {
      if (!response.ok) {
        throw response
      }
      return response
    })
    .then(function(response) {
      return response[props.response]()
    })
    .then(function(result) {
      dispatch(props.action, result)
    })
    .catch(function(error) {
      dispatch(props.error, error)
    })
}

export function Http(options) {
  return {
    props: assign(
      {
        response: "json",
        error: options.action
      },
      options
    ),
    effect: httpEffect
  }
}
