export const runFx = fx => {
  const dispatch = jest.fn()
  const unsubscribe = fx[0](dispatch, fx[1])
  return { dispatch, unsubscribe }
}
