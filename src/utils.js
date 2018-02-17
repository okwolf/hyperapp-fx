export function assign(source, assignments) {
  var result = {}
  for (var i in source) result[i] = source[i]
  for (var i in assignments) result[i] = assignments[i]
  return result
}

export function omit(object, keys) {
  var copy = {}
  Object.keys(object)
    .filter(key => keys.indexOf(key) === -1)
    .forEach(key => {
      copy[key] = object[key]
    })
  return copy
}
