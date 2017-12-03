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

var isEffect = Array.isArray
var isFn = function(value) {
  return typeof value === "function"
}

function getAction(actions, name) {
  function getNextAction(partialActions, paths) {
    var nextAction = partialActions[paths[0]]
    return paths.length === 1
      ? nextAction
      : getNextAction(nextAction, paths.slice(1))
  }
  return getNextAction(actions, name.split("."))
}

function runIfEffect(actions, currentEvent, maybeEffect) {
  if (!isEffect(maybeEffect)) {
    // Not an effect
    return maybeEffect
  } else if (isEffect(maybeEffect[0])) {
    // Run an array of effects
    for (var i in maybeEffect) {
      runIfEffect(actions, currentEvent, maybeEffect[i])
    }
  } else {
    // Run a single effect
    var type = maybeEffect[0]
    var props = maybeEffect[1]
    switch (type) {
      case ACTION:
        getAction(actions, props.name)(props.data)
        break
      case FRAME:
        requestAnimationFrame(function(time) {
          getAction(actions, props.action)(time)
        })
        break
      case DELAY:
        setTimeout(function() {
          getAction(actions, props.action)(props.data)
        }, props.duration)
        break
      case TIME:
        getAction(actions, props.action)(performance.now())
        break
      case LOG:
        console.log.apply(null, props.args)
        break
      case HTTP:
        props.options = props.options || {}
        props.options.response = props.options.response || "json"
        fetch(props.url, props.options)
          .then(function(response) {
            return response[props.options.response]()
          })
          .then(function(result) {
            getAction(actions, props.action)(result)
          })
        break
      case EVENT:
        getAction(actions, props.action)(currentEvent)
        break
      case KEY_DOWN:
        document.onkeydown = function(keyEvent) {
          getAction(actions, props.action)(keyEvent)
        }
        break
      case KEY_UP:
        document.onkeyup = function(keyEvent) {
          getAction(actions, props.action)(keyEvent)
        }
        break
      case RANDOM:
        var randomValue = Math.random() * (props.max - props.min) + props.min
        getAction(actions, props.action)(randomValue)
        break
    }
  }
}

function enhanceActions(actions) {
  return Object.keys(actions || {}).reduce(function(otherActions, name) {
    var action = actions[name]
    otherActions[name] = isFn(action)
      ? function(data) {
          return function(state) {
            return function(actions) {
              var result = action(data)
              result = isFn(result) ? result(state) : result
              result = isFn(result) ? result(actions) : result
              return runIfEffect(actions, null, result)
            }
          }
        }
      : enhanceActions(action)
    return otherActions
  }, {})
}

function handleEventEffect(actions, effect) {
  return function(currentEvent) {
    runIfEffect(actions, currentEvent, effect)
  }
}

function patchVdomEffects(actions, vdom) {
  if (typeof vdom === "object") {
    for (var key in vdom.props) {
      var maybeEffect = vdom.props[key]
      if (isEffect(maybeEffect)) {
        vdom.props[key] = handleEventEffect(actions, maybeEffect)
      }
    }
    for (var i in vdom.children) {
      patchVdomEffects(actions, vdom.children[i])
    }
  }
}

export default function withEffects(app) {
  return function(props) {
    props.actions = enhanceActions(props.actions)

    if (props.view) {
      var originalView = props.view
      props.view = function(state) {
        return function(actions) {
          var result = originalView(state)
          result = isFn(result) ? result(actions) : result
          patchVdomEffects(actions, result)
          return result
        }
      }
    }

    return app(props)
  }
}
