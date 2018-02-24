export function fxIf(fxSpecs) {
  return fxSpecs
    .filter(function(fxSpec) {
      // first element is the conditional
      return fxSpec[0]
    })
    .map(function(fxSpec) {
      // second element is the effect to include
      return fxSpec[1]
    })
}
