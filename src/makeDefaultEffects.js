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
  RANDOM
} from "./effectTypes"

export default function makeDefaultEffects() {
  var effects = {}

  effects[ACTION] = function(props, getAction) {
    getAction(props.name)(props.data)
  }

  effects[FRAME] = function(props, getAction) {
    requestAnimationFrame(function(time) {
      getAction(props.action)(time)
    })
  }

  effects[DELAY] = function(props, getAction) {
    setTimeout(function() {
      getAction(props.action)(props.data)
    }, props.duration)
  }

  effects[TIME] = function(props, getAction) {
    getAction(props.action)(performance.now())
  }

  effects[LOG] = function(props, getAction) {
    console.log.apply(null, props.args)
  }

  effects[HTTP] = function(props, getAction) {
    props.options = props.options || {}
    props.options.response = props.options.response || "json"
    var errorAction = props.options.error || props.action
    if (props.options.error) {
      delete props.options.error
    }
    fetch(props.url, props.options)
      .then(function(response) {
        return response[props.options.response]()
      })
      .then(function(result) {
        getAction(props.action)(result)
      })
      .catch(function(err) {
        getAction(errorAction)(err)
      })
  }

  effects[EVENT] = function(props, getAction) {
    getAction(props.action)(props.event)
  }

  effects[KEY_DOWN] = function(props, getAction) {
    document.onkeydown = function(keyEvent) {
      getAction(props.action)(keyEvent)
    }
  }

  effects[KEY_UP] = function(props, getAction) {
    document.onkeyup = function(keyEvent) {
      getAction(props.action)(keyEvent)
    }
  }

  effects[RANDOM] = function(props, getAction) {
    var randomValue = Math.random() * (props.max - props.min) + props.min
    getAction(props.action)(randomValue)
  }

  return effects
}
