export function removeKeysFromObject(object, keys) {
  return Object.keys(object)
    .filter(k => keys.indexOf(k) === -1)
    .reduce((acc, k) => Object.assign({}, acc, { [k]: object[k] }), {})
}
