var isEffect = Array.isArray

function runIfEffect(actions, maybeEffect) {
  if (!isEffect(maybeEffect)) {
    // Not an effect
    return maybeEffect
  } else if (isEffect(maybeEffect[0])) {
    // Run an array of effects
    maybeEffect.map(runIfEffect.bind(null, actions))
  } else {
    // Run a single effect
    var type = maybeEffect[0]
    var props = maybeEffect[1]
    props.data = props.data || {}
    switch (type) {
      case "action":
        actions[props.name](props.data)
        break
      case "update":
        actions.update(props.state)
        break
      case "frame":
        requestAnimationFrame(function(time) {
          props.data.time = time
          actions[props.action](props.data)
        })
        break
      case "delay":
        setTimeout(function() {
          actions[props.action](props.data)
        }, props.duration)
        break
      case "time":
        props.data.time = performance.now()
        actions[props.action](props.data)
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
            actions[props.action](result)
          })
        break
    }
  }
}

export function withEffects(app) {
  return function(props) {
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
                  return runIfEffect(actions, maybeEffect)
                }
              }
            : enhanceActions(action)
        return otherActions
      }, {})
    }

    props.actions = enhanceActions(props.actions)
    props.actions.update = function(state, actions) {
      return function(newState) {
        return newState
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

export function update(state) {
  return ["update", { state: state }]
}

export function frame(action, data) {
  return [
    "frame",
    {
      action: action,
      data: data
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

export function time(action, data) {
  return [
    "time",
    {
      action: action,
      data: data
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
