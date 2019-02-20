export const runFx = fx => {
  const dispatch = jest.fn()
  const unsubscribe = fx[0](fx[1], dispatch)
  return { dispatch, unsubscribe }
}
