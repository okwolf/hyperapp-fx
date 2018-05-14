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

function runInFrame(dispatch, props) {
  requestAnimationFrame(function(time) {
    dispatch(makeDispatchAction(props.action, time))
  })
}
export function frame(action) {
  return makeCommand(
    {
      action: action
    },
    runInFrame
  )
}

function runAfterDelay(dispatch, props) {
  setTimeout(function() {
    dispatch(makeDispatchAction(props.action, props.data))
  }, props.duration)
}
export function delay(duration, action, data) {
  return makeCommand(
    {
      action: action,
      duration: duration,
      data: data
    },
    runAfterDelay
  )
}

function runWithCurrentTime(dispatch, props) {
  dispatch(makeDispatchAction(props.action, performance.now()))
}
export function time(action) {
  return makeCommand(
    {
      action: action
    },
    runWithCurrentTime
  )
}

function runWithLogging(dispatch, props) {
  // eslint-disable-next-line no-console
  console.log.apply(null, props.args)
}
export function log() {
  return makeCommand(
    {
      args: arguments
    },
    runWithLogging
  )
}

function runWithHttpRequest(dispatch, props) {
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
    runWithHttpRequest
  )
}

// FIXME: convert to subscription
function runOnKeyDown(dispatch, props) {
  document.onkeydown = function(keyEvent) {
    dispatch(makeDispatchAction(props.action, keyEvent))
  }
}
export function keydown(action) {
  return makeCommand(
    {
      action: action
    },
    runOnKeyDown
  )
}

// FIXME: convert to subscription
function runOnKeyUp(dispatch, props) {
  document.onkeyup = function(keyEvent) {
    dispatch(makeDispatchAction(props.action, keyEvent))
  }
}
export function keyup(action) {
  return makeCommand(
    {
      action: action
    },
    runOnKeyUp
  )
}

function runWithRandomNumber(dispatch, props) {
  var randomValue = Math.random() * (props.max - props.min) + props.min
  dispatch(makeDispatchAction(props.action, randomValue))
}
export function random(action, min, max) {
  return makeCommand(
    {
      action: action,
      min: min || 0,
      max: max || 1
    },
    runWithRandomNumber
  )
}

var debounceTimeouts = {}
function runWithDebounce(dispatch, props) {
  clearTimeout(debounceTimeouts[props.action])
  debounceTimeouts[props.action] = setTimeout(function() {
    dispatch(makeDispatchAction(props.action, props.data))
  }, props.wait)
}
export function debounce(wait, action, data) {
  return makeCommand(
    {
      wait: wait,
      action: action,
      data: data
    },
    runWithDebounce
  )
}

var throttleLocks = {}
function runWithThrottle(dispatch, props) {
  if (!throttleLocks[props.action]) {
    dispatch(makeDispatchAction(props.action, props.data))
    throttleLocks[props.action] = true
    setTimeout(function() {
      throttleLocks[props.action] = false
    }, props.rate)
  }
}
export function throttle(rate, action, data) {
  return makeCommand(
    {
      rate: rate,
      action: action,
      data: data
    },
    runWithThrottle
  )
}
