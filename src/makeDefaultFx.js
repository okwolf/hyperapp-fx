import {
  ACTION,
  FRAME,
  DELAY,
  TIME,
  LOG,
  HTTP,
  EVENT,
  KEY_DOWN,
  KEY_UP,
  RANDOM,
  DEBOUNCE,
  THROTTLE
} from "./fxTypes"
import { assign, omit } from "./utils.js"

export default function makeDefaultFx() {
  var fx = {}

  fx[ACTION] = function(props, getAction) {
    getAction(props.name)(props.data)
  }

  fx[FRAME] = function(props, getAction) {
    requestAnimationFrame(function(time) {
      getAction(props.action)(time)
    })
  }

  fx[DELAY] = function(props, getAction) {
    setTimeout(function() {
      getAction(props.action)(props.data)
    }, props.duration)
  }

  fx[TIME] = function(props, getAction) {
    getAction(props.action)(performance.now())
  }

  fx[LOG] = function(props, getAction) {
    console.log.apply(null, props.args)
  }

  fx[HTTP] = function(props, getAction) {
    var options = assign(
      {
        response: "json",
        error: props.action
      },
      props.options
    )
    var fetchOptions = omit(options, ["response", "error"])
    fetch(props.url, fetchOptions)
      .then(function(response) {
        if (!response.ok) {
          throw response
        }
        return response
      })
      .then(function(response) {
        return response[options.response]()
      })
      .then(function(result) {
        getAction(props.action)(result)
      })
      .catch(function(error) {
        getAction(options.error)(error)
      })
  }

  fx[EVENT] = function(props, getAction) {
    getAction(props.action)(props.event)
  }

  fx[KEY_DOWN] = function(props, getAction) {
    document.onkeydown = function(keyEvent) {
      getAction(props.action)(keyEvent)
    }
  }

  fx[KEY_UP] = function(props, getAction) {
    document.onkeyup = function(keyEvent) {
      getAction(props.action)(keyEvent)
    }
  }

  fx[RANDOM] = function(props, getAction) {
    var randomValue = Math.random() * (props.max - props.min) + props.min
    getAction(props.action)(randomValue)
  }

  var debounceTimeouts = {}
  fx[DEBOUNCE] = function(props, getAction) {
    return (function(props, getAction) {
      clearTimeout(debounceTimeouts[props.action])
      debounceTimeouts[props.action] = setTimeout(function () {
        getAction(props.action)(props.data)
      }, props.wait)
    })(props, getAction)
  }

  var throttleLocks = {}
  fx[THROTTLE] = function(props, getAction) {
    return (function (props, getAction) {
      if(!throttleLocks[props.action]) {
        getAction(props.action)(props.data)
        throttleLocks[props.action] = true
        setTimeout(() => {
          throttleLocks[props.action] = false
        }, props.rate)
      }
    })(props, getAction)
  }

  return fx
}
