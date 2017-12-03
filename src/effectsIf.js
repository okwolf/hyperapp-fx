export default function effectsIf(effectSpecs) {
  return effectSpecs
    .filter(function(effectSpec) {
      // first element is the conditional
      return effectSpec[0]
    })
    .map(function(effectSpec) {
      // second element is the effect to include
      return effectSpec[1]
    })
}
