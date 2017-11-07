function makeRunEffect(actions) {
  return function(effect) {
    var type = effect[0]
    var params = effect[1]
    switch (type) {
      case "action":
        actions[params.name](params.data)
        break
      case "update":
        actions.update(params.state)
        break
      case "frame":
        requestAnimationFrame(function() {
          actions[params.name](params.data)
        })
        break
      case "delay":
        setTimeout(function() {
          actions[params.name](params.data)
        }, params.duration)
        break
    }
  }
}

module.exports = function(app) {
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

module.exports.action = function(name, data) {
  return ["action", { name: name, data: data }]
}

module.exports.update = function(state) {
  return ["update", { state: state }]
}

module.exports.frame = function(name, data) {
  return ["frame", { name: name, data: data }]
}

module.exports.delay = function(duration, name, data) {
  return ["delay", { duration: duration, name: name, data: data }]
}
