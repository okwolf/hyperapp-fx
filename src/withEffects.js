import { assign } from "./utils.js"
import makeDefaultEffects from "./makeDefaultEffects"

var isEffect = Array.isArray
var isFn = function(value) {
  return typeof value === "function"
}

function getActionNamed(actions, name) {
  function getNextAction(partialActions, paths) {
    var nextAction = partialActions[paths[0]]
    return paths.length === 1
      ? nextAction
      : getNextAction(nextAction, paths.slice(1))
  }
  return getNextAction(actions, name.split("."))
}

function runIfEffect(actions, currentEvent, maybeEffect, effects) {
  var getAction = getActionNamed.bind(null, actions)
  if (!isEffect(maybeEffect)) {
    // Not an effect
    return maybeEffect
  } else if (isEffect(maybeEffect[0])) {
    // Run an array of effects
    for (var i in maybeEffect) {
      runIfEffect(actions, currentEvent, maybeEffect[i], effects)
    }
  } else {
    // Run a single effect
    var type = maybeEffect[0]
    var props = assign(maybeEffect[1], { event: currentEvent })
    effects[type](props, getAction)
  }
}

function enhanceActions(actionsTemplate, effects) {
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
            return runIfEffect(actions, null, result, effects)
          }
        }
      : enhanceActions(action, effects)
    return otherActions
  },
  {})
}

function handleEventEffect(actions, effect, effects) {
  return function(currentEvent) {
    runIfEffect(actions, currentEvent, effect, effects)
  }
}

function patchVdomEffects(actions, vdom, effects) {
  if (typeof vdom === "object") {
    for (var key in vdom.attributes) {
      var maybeEffect = vdom.attributes[key]
      if (isEffect(maybeEffect)) {
        vdom.attributes[key] = handleEventEffect(actions, maybeEffect, effects)
      }
    }
    for (var i in vdom.children) {
      patchVdomEffects(actions, vdom.children[i], effects)
    }
  }
}

function makeEffectsApp(effects, nextApp) {
  return function(initialState, actionsTemplate, view, container) {
    var enhancedActions = enhanceActions(actionsTemplate, effects)
    var enhancedView = isFn(view)
      ? function(state, actions) {
          var vdom = view(state, actions)
          patchVdomEffects(actions, vdom, effects)
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

export default function withEffects(effectsOrApp) {
  var effects = makeDefaultEffects()
  if (typeof effectsOrApp === "function") {
    return makeEffectsApp(effects, effectsOrApp)
  } else {
    for (var name in effectsOrApp) {
      effects[name] = effectsOrApp[name]
    }
    return function(nextApp) {
      return makeEffectsApp(effects, nextApp)
    }
  }
}
