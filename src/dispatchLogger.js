// Including a logger, since 2.0 dispatch is incompatible with existing tools
// TODO: Remove this if a middleware API makes it in
export function dispatchLogger(state, action, actionResult) {
  /* eslint-disable no-console */
  console.group(
    "%c fx%c/DISPATCH",
    "color: gray; font-weight: lighter;",
    "color: inherit; font-weight: bold;"
  )
  console.log("%c state", "color: #9E9E9E; font-weight: bold;", state)
  console.log("%c action", "color: #03A9F4; font-weight: bold;", action)
  console.log("%c result", "color: #4CAF50; font-weight: bold;", actionResult)
  console.groupEnd()
  /* eslint-enable no-console */
}
