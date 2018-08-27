import { assign } from "../utils.js"

function mergeEffect(props, dispatch) {
  dispatch(function(state) {
    return assign(state, props.action(state))
  })
}

export function Merge(action) {
  return {
    action: action,
    effect: mergeEffect
  }
}
