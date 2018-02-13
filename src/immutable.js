export function removeKeysFromObject(object, keys) {
  return Object.entries(object)
    .filter(([k, v]) => keys.indexOf(k) === -1)
    .reduce((acc, [k, v]) => Object.assign({}, acc, { [k]: v }), {})
}
