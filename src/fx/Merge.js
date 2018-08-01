import { assign } from "../utils.js"

export function Merge(action) {
  return {
    props: action,
    effect: function(action, dispatch) {
      dispatch(function(state) {
        return assign(state, action(state))
      })
    }
  }
}
