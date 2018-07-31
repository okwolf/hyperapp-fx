export function assign(source, assignments) {
  var result = {},
    i
  for (i in source) result[i] = source[i]
  for (i in assignments) result[i] = assignments[i]
  return result
}

export function makeRemoveListener(eventName, dispatch, action) {
  function handler(eventData) {
    dispatch(action, eventData)
  }
  document.addEventListener(eventName, handler)
  return function() {
    document.removeEventListener(eventName, handler)
  }
}
