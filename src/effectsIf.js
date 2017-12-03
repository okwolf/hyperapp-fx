function getArrayElement(index) {
  return function(array) {
    return array[index]
  }
}

export default function effectsIf(effectSpecs) {
  return effectSpecs.filter(getArrayElement(0)).map(getArrayElement(1))
}
