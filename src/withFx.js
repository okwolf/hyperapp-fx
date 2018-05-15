import {
  INTERNAL_DISPATCH,
  INTERNAL_COMMAND,
  REFACTOR_FOR_V2
} from "./constants"
import { assign, difference } from "./utils.js"
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
            options.warn("Still using wired action: '" + namedspacedName + "'.")
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

function makeEventHandler(options, actions, currentAction, key) {
  return function(currentEvent) {
    var actionData
    if (isFn(currentAction)) {
      if (!currentAction(currentEvent)) {
        options.warn(
          "Still using old-style event listener for event: '" + key + "'."
        )
      } else {
        actionData = makeDispatchAction(currentAction, currentEvent)
      }
    } else {
      actionData = currentAction
    }
    if (actionData) {
      actions.dispatch(actionData)
    }
  }
}

function makeEnhancedView(options, view) {
  function patchVdom(state, actions, vdom) {
    if (typeof vdom === "object") {
      for (var key in vdom.attributes) {
        if (key[0] === "o" && key[1] === "n") {
          vdom.attributes[key] = makeEventHandler(
            options,
            actions,
            vdom.attributes[key],
            key
          )
        }
      }
      for (var i in vdom.children) {
        if (isFn(vdom.children[i])) {
          // TODO: error if using lazy components?
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
      var omittedStateKeys = difference(
        Object.keys(state),
        Object.keys(actionResult || {})
      )
      if (omittedStateKeys.length) {
        options.warn(
          "New state will no longer be shallow-merged with existing state. The following state keys were ommited: '" +
            omittedStateKeys.join(", ") +
            "'."
        )
      }
      return actionResult
    }
  }
}

function makeFxApp(options, nextApp) {
  return function(initialState, actionsTemplate, view, container) {
    var optionsWithWarn = assign(options, {
      warn: function(message) {
        var completeMessage = message + REFACTOR_FOR_V2
        if (options.strictMode) {
          throw new Error(completeMessage)
        } else {
          // eslint-disable-next-line no-console
          console.warn(completeMessage)
        }
      }
    })
    var enhancedActions = makeEnhancedActions(optionsWithWarn, actionsTemplate)
    enhancedActions.dispatch = makeDispatch(optionsWithWarn)
    var enhancedView = makeEnhancedView(optionsWithWarn, view)

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
