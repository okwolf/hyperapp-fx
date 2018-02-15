export function removeKeysFromObject(object, keys) {
  var copy = {}
  Object.keys(object)
    .filter(key => keys.indexOf(key) === -1)
    .forEach(key => {
      copy[key] = object[key]
    })
  return copy
}
