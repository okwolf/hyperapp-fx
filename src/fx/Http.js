import { assign } from "../utils.js"

function httpEffect(dispatch, props) {
  fetch(props.url, props.options)
    .then(function (response) {
      if (!response.ok) {
        throw response
      }
      return response
    })
    .then(function (response) {
      return response[props.response]()
    })
    .then(function (result) {
      dispatch(props.action, result)
    })
    .catch(function (error) {
      dispatch(props.error, error)
    })
}

/**
 * Describes an effect that will send an HTTP request using [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) and then call an action with the response. If you are using a browser from the Proterozoic Eon like Internet Explorer you will want one of the [available](https://github.com/developit/unfetch) `fetch` [polyfills](https://github.com/github/fetch).
 *
 * @memberof module:fx
 * @param {object} props
 * @param {string} props.url - URL for sending HTTP request
 * @param {object} props.options - same [options as `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#Parameters)
 * @param {string} props.response - Specify which method to use on the response body, defaults to `"json"`, other [supported methods](https://developer.mozilla.org/en-US/docs/Web/API/Response#Methods) include `"text"`
 * @param {*} props.action - Action to call with the results of a successful HTTP response
 * @param {*} props.error - Action to call if there is a problem making the request or a not-ok HTTP response, defaults to the same action defined for success
 * @example
 * import { Http } from "hyperapp-fx"
 *
 * const Login = state => [
 *   state,
 *   Http({
 *     url: "/login",
 *     options: {
 *       method: "POST",
 *       body: form
 *     },
 *     action(state, loginResponse) {
 *       // loginResponse will have the JSON-decoded response from POSTing to /login
 *     },
 *     error(state, error) {
 *       // please handle your errors...
 *     }
 *   })
 * ]
 */
export function Http(props) {
  return [
    httpEffect,
    assign(
      {
        options: {},
        response: "json",
        error: props.action
      },
      props
    )
  ]
}
