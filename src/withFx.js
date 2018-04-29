import { INTERNAL_DISPATCH, INTERNAL_COMMAND } from "./constants"
import { makeDispatchAction } from "./fxCreators"
import { dispatchLogger } from "./dispatchLogger"

var isFn = function(value) {
  return typeof value === "function"
}

function makeEnhancedActions(options, actionsTemplate, prefix) {
  var namespace = prefix ? prefix + "." : ""
  return Object.keys(actionsTemplate || {}).reduce(function(
    otherActions,
    name
  ) {
    var namedspacedName = namespace + name
    var action = actionsTemplate[name]
    otherActions[name] = isFn(action)
      ? function(data) {
          return function(state, actions) {
            if (options.wiredActions !== true) {
              throw new Error(
                "Still using wired action: '" +
                  namedspacedName +
                  "'. You need to refactor this before moving to Hyperapp 2.0."
              )
            }
            var result = action(data)
            result = isFn(result) ? result(state, actions) : result
            return result
          }
        }
      : makeEnhancedActions(options, action, namedspacedName)
    return otherActions
  },
  {})
}

function makeEventHandler(state, actions, currentAction) {
  return function(currentEvent) {
    var actionData = {}
    if (isFn(currentAction)) {
      actionData = makeDispatchAction(currentAction, currentEvent)
    } else {
      actionData = currentAction
    }
    actions.dispatch(actionData)
  }
}

function makeEnhancedView(options, view) {
  function patchVdom(state, actions, vdom) {
    if (typeof vdom === "object") {
      for (var key in vdom.attributes) {
        if (options.wiredActions !== true && key[0] === "o" && key[1] === "n") {
          vdom.attributes[key] = makeEventHandler(
            state,
            actions,
            vdom.attributes[key]
          )
        }
      }
      for (var i in vdom.children) {
        if (isFn(vdom.children[i])) {
          // TODO: warn if using lazy components?
          vdom.children[i] = makeEnhancedView(options, vdom.children[i])
        } else {
          patchVdom(state, actions, vdom.children[i])
        }
      }
    }
  }
  return function(state, actions) {
    var vdom = view(state, actions)
    patchVdom(state, actions, vdom)
    return vdom
  }
}

function makeDispatch(options) {
  return function(action) {
    return function(state, actions) {
      var actionResult = action
      if (isFn(action)) {
        actionResult = action(state)
      } else if (Array.isArray(action)) {
        actionResult = state
        action.map(function(childAction) {
          setTimeout(function() {
            actions.dispatch(childAction)
          })
        })
      } else if (INTERNAL_DISPATCH in action) {
        var actionData = action[INTERNAL_DISPATCH]
        actionResult = actionData.action(state, actionData.data)
      } else if (INTERNAL_COMMAND in action) {
        actionResult = action.runFx(actions.dispatch, action.props)
      }

      if (options.logger) {
        dispatchLogger(state, action, actionResult)
      }
      return actionResult
    }
  }
}

function makeFxApp(options, nextApp) {
  return function(initialState, actionsTemplate, view, container) {
    var enhancedActions = makeEnhancedActions(options, actionsTemplate)
    enhancedActions.dispatch = makeDispatch(options)
    var enhancedView = makeEnhancedView(options, view)

    var appActions = nextApp(
      initialState,
      enhancedActions,
      enhancedView,
      container
    )
    return appActions
  }
}

export function withFx(optionsOrApp) {
  if (isFn(optionsOrApp)) {
    return makeFxApp({}, optionsOrApp)
  } else {
    return function(nextApp) {
      return makeFxApp(optionsOrApp, nextApp)
    }
  }
}
