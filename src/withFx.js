import { assign } from "./utils.js"
import makeDefaultFx from "./makeDefaultFx"

var isFx = Array.isArray
var isFn = function(value) {
  return typeof value === "function"
}

function getActionNamed(actions, name) {
  function getNextAction(partialActions, paths) {
    var nextAction = partialActions[paths[0]]
    if (!nextAction) {
      throw new Error("couldn't find action: " + name)
    }
    return paths.length === 1
      ? nextAction
      : getNextAction(nextAction, paths.slice(1))
  }
  return getNextAction(actions, name.split("."))
}

function runIfFx(actions, currentEvent, maybeFx, fx) {
  if (!isFx(maybeFx)) {
    // Not an effect
    return maybeFx
  } else if (isFx(maybeFx[0])) {
    // Run an array of effects
    for (var i in maybeFx) {
      runIfFx(actions, currentEvent, maybeFx[i], fx)
    }
  } else if (maybeFx.length) {
    // Run a single effect
    var getAction = getActionNamed.bind(null, actions)
    var type = maybeFx[0]
    var props = assign(maybeFx[1], { event: currentEvent })
    fx[type](props, getAction)
  }
}

function enhanceActions(actionsTemplate, fx) {
  return Object.keys(actionsTemplate || {}).reduce(function(
    otherActions,
    name
  ) {
    var action = actionsTemplate[name]
    otherActions[name] = isFn(action)
      ? function(data) {
          return function(state, actions) {
            var result = action(data)
            result = isFn(result) ? result(state, actions) : result
            return runIfFx(actions, null, result, fx)
          }
        }
      : enhanceActions(action, fx)
    return otherActions
  },
  {})
}

function handleEventFx(actions, currentFx, fx) {
  return function(currentEvent) {
    runIfFx(actions, currentEvent, currentFx, fx)
  }
}

function patchVdomFx(actions, vdom, fx) {
  if (typeof vdom === "object") {
    for (var key in vdom.attributes) {
      var maybeFx = vdom.attributes[key]
      if (isFx(maybeFx)) {
        vdom.attributes[key] = handleEventFx(actions, maybeFx, fx)
      }
    }
    for (var i in vdom.children) {
      patchVdomFx(actions, vdom.children[i], fx)
    }
  }
}

function makeFxApp(fx, nextApp) {
  return function(initialState, actionsTemplate, view, container) {
    var enhancedActions = enhanceActions(actionsTemplate, fx)
    var enhancedView = isFn(view)
      ? function(state, actions) {
          var vdom = view(state, actions)
          patchVdomFx(actions, vdom, fx)
          return vdom
        }
      : undefined

    var appActions = nextApp(
      initialState,
      enhancedActions,
      enhancedView,
      container
    )
    return appActions
  }
}

export function withFx(fxOrApp) {
  var fx = makeDefaultFx()
  if (typeof fxOrApp === "function") {
    return makeFxApp(fx, fxOrApp)
  } else {
    for (var name in fxOrApp) {
      fx[name] = fxOrApp[name]
    }
    return function(nextApp) {
      return makeFxApp(fx, nextApp)
    }
  }
}
