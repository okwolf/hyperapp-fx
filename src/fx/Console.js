function consoleEffect(args) {
  // eslint-disable-next-line no-console
  console.log.apply(null, args)
}

export function Console() {
  return {
    props: arguments,
    effect: consoleEffect
  }
}
