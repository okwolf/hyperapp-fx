function runEffect(actions, effect) {
  if (Array.isArray(effect)) {
    var type = effect[0]
    if (typeof type === "string") {
      var props = effect[1]
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
      }
    } else if (Array.isArray(type)) {
      effect.map(runEffect.bind(null, actions))
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
                  var nextStateOrEffects =
                    typeof result === "function" ? result(data) : result
                  if (Array.isArray(nextStateOrEffects)) {
                    runEffect(actions, nextStateOrEffects)
                  } else {
                    return nextStateOrEffects
                  }
                }
              }
            : enhanceActions(action)
        return otherActions
      }, {})
    }

    function enhanceModules(module) {
      module.actions = enhanceActions(module.actions)

      module.actions.update = function(state, actions) {
        return function(newState) {
          return newState
        }
      }

      Object.keys(module.modules || {}).map(function(name) {
        enhanceModules(module.modules[name])
      })
    }

    enhanceModules(props)
    var appActions = app(props)

    return appActions
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
