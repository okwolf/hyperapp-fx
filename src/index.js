function makeRunEffect(actions) {
  return function(effect) {
    switch (effect.type) {
      case "action":
        actions[effect.name](effect.data)
        break
      case "update":
        actions.update(effect.state)
        break
      case "frame":
        requestAnimationFrame(function() {
          actions[effect.action](effect.data)
        })
        break
      case "delay":
        setTimeout(function() {
          actions[effect.action](effect.data)
        }, effect.duration)
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
                  var nextStateOrEffects =
                    typeof result === "function" ? result(data) : result
                  if (Array.isArray(nextStateOrEffects)) {
                    var runEffect = makeRunEffect(actions)
                    nextStateOrEffects.map(runEffect)
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

export function Action(props) {
  return { type: "action", name: props.name, data: props.data }
}

export function Update(props) {
  return { type: "update", state: props.state }
}

export function Frame(props) {
  return { type: "frame", action: props.action, data: props.data }
}

export function Delay(props) {
  return {
    type: "delay",
    duration: props.duration,
    action: props.action,
    data: props.data
  }
}
