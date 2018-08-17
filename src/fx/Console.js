export function Console() {
  return {
    props: arguments,
    effect: function(args) {
      // eslint-disable-next-line no-console
      console.log.apply(null, args)
    }
  }
}
