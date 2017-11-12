var isEffect = Array.isArray

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
      case "action":
        getAction(actions, props.name)(props.data)
        break
      case "frame":
        requestAnimationFrame(function(time) {
          getAction(actions, props.action)(time)
        })
        break
      case "delay":
        setTimeout(function() {
          getAction(actions, props.action)(props.data)
        }, props.duration)
        break
      case "time":
        getAction(actions, props.action)(performance.now())
        break
      case "log":
        console.log.apply(null, props.args)
        break
      case "http":
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
      case "event":
        getAction(actions, props.action)(currentEvent)
        break
      case "keydown":
        document.onkeydown = function(keyEvent) {
          getAction(actions, props.action)(keyEvent)
        }
        break
      case "keyup":
        document.onkeyup = function(keyEvent) {
          getAction(actions, props.action)(keyEvent)
        }
        break
      case "random":
        var randomValue = Math.random() * (props.max - props.min) + props.min
        getAction(actions, props.action)(randomValue)
        break
    }
  }
}

function enhanceActions(actions) {
  return Object.keys(actions || {}).reduce(function(otherActions, name) {
    var action = actions[name]
    otherActions[name] =
      typeof action === "function"
        ? function(state, actions) {
            return function(data) {
              var result = action(state, actions)
              var maybeEffect =
                typeof result === "function" ? result(data) : result
              return runIfEffect(actions, null, maybeEffect)
            }
          }
        : enhanceActions(action)
    return otherActions
  }, {})
}

function patchVdomEffects(actions, vdom) {
  if (typeof vdom === "object") {
    for (var key in vdom.props) {
      var maybeEffect = vdom.props[key]
      if (isEffect(maybeEffect)) {
        vdom.props[key] = function(currentEvent) {
          runIfEffect(actions, currentEvent, maybeEffect)
        }
      }
    }
    for (var i in vdom.children) {
      patchVdomEffects(actions, vdom.children[i])
    }
  }
}

export function withEffects(app) {
  return function(props) {
    props.actions = enhanceActions(props.actions)

    if (props.view) {
      var originalView = props.view
      props.view = function(state, actions) {
        var nextVdom = originalView(state, actions)
        patchVdomEffects(actions, nextVdom)
        return nextVdom
      }
    }

    return app(props)
  }
}

export function action(name, data) {
  return [
    "action",
    {
      name: name,
      data: data
    }
  ]
}

export function frame(action) {
  return [
    "frame",
    {
      action: action
    }
  ]
}

export function delay(duration, action, data) {
  return [
    "delay",
    {
      duration: duration,
      action: action,
      data: data
    }
  ]
}

export function time(action) {
  return [
    "time",
    {
      action: action
    }
  ]
}

export function log() {
  return [
    "log",
    {
      args: arguments
    }
  ]
}

export function http(url, action, options) {
  return [
    "http",
    {
      url: url,
      action: action,
      options: options
    }
  ]
}

export function event(action) {
  return [
    "event",
    {
      action: action
    }
  ]
}

export function keydown(action) {
  return [
    "keydown",
    {
      action: action
    }
  ]
}

export function keyup(action) {
  return [
    "keyup",
    {
      action: action
    }
  ]
}

export function random(action, min, max) {
  return [
    "random",
    {
      action: action,
      min: min || 0,
      max: max || 1
    }
  ]
}
