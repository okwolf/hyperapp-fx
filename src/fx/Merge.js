import { assign } from "../utils.js"

function mergeEffect(action, dispatch) {
  dispatch(function(state) {
    return assign(state, action(state))
  })
}

export function Merge(action) {
  return {
    props: action,
    effect: mergeEffect
  }
}
