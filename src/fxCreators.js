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

export function frame(action) {
  return makeCommand(
    {
      action: action
    },
    function(dispatch, props) {
      requestAnimationFrame(function(time) {
        dispatch(makeDispatchAction(props.action, time))
      })
    }
  )
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

export function time(action) {
  return makeCommand(
    {
      action: action
    },
    function(dispatch, props) {
      dispatch(makeDispatchAction(props.action, performance.now()))
    }
  )
}

export function log() {
  return makeCommand(
    {
      args: arguments
    },
    function(dispatch, props) {
      // eslint-disable-next-line no-console
      console.log.apply(null, props.args)
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

export function keydown(action) {
  return makeCommand(
    {
      action: action
    },
    function(dispatch, props) {
      document.onkeydown = function(keyEvent) {
        dispatch(makeDispatchAction(props.action, keyEvent))
      }
    }
  )
}

export function keyup(action) {
  return makeCommand(
    {
      action: action
    },
    function(dispatch, props) {
      document.onkeyup = function(keyEvent) {
        dispatch(makeDispatchAction(props.action, keyEvent))
      }
    }
  )
}

export function random(action, min, max) {
  return makeCommand(
    {
      action: action,
      min: min || 0,
      max: max || 1
    },
    function(dispatch, props) {
      var randomValue = Math.random() * (props.max - props.min) + props.min
      dispatch(makeDispatchAction(props.action, randomValue))
    }
  )
}

var debounceTimeouts = {}
export function debounce(wait, action, data) {
  return makeCommand(
    {
      wait: wait,
      action: action,
      data: data
    },
    function(dispatch, props) {
      clearTimeout(debounceTimeouts[props.action])
      debounceTimeouts[props.action] = setTimeout(function() {
        dispatch(makeDispatchAction(props.action, props.data))
      }, props.wait)
    }
  )
}

var throttleLocks = {}
export function throttle(rate, action, data) {
  return makeCommand(
    {
      rate: rate,
      action: action,
      data: data
    },
    function(dispatch, props) {
      if (!throttleLocks[props.action]) {
        dispatch(makeDispatchAction(props.action, props.data))
        throttleLocks[props.action] = true
        setTimeout(function() {
          throttleLocks[props.action] = false
        }, props.rate)
      }
    }
  )
}
