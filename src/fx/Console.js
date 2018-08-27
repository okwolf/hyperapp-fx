function consoleEffect(props) {
  // eslint-disable-next-line no-console
  console.log.apply(null, props.args)
}

export function Console() {
  return {
    args: arguments,
    effect: consoleEffect
  }
}
