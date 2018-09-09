export const runFx = fx => {
  const dispatch = jest.fn()
  const unsubscribe = fx.effect(fx, dispatch)
  return { dispatch, unsubscribe }
}
