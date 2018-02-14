export function removeKeysFromObject(object, keys) {
  var cpy = {}
  Object.keys(object)
    .filter(k => keys.indexOf(k) === -1)
    .forEach(k => {
      cpy[k] = object[k]
    })
  return cpy
}
