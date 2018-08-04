export function assign(source, assignments) {
  var result = {},
    i
  for (i in source) result[i] = source[i]
  for (i in assignments) result[i] = assignments[i]
  return result
}

export function makeRemoveListener(attachTo, dispatch, action, eventName) {
  var handler = dispatch.bind(null, action)
  attachTo.addEventListener(eventName, handler)
  return function() {
    attachTo.removeEventListener(eventName, handler)
  }
}
