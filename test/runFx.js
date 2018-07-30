export const runFx = fx => {
  const dispatch = jest.fn()
  const unsubscribe = fx.effect(fx.props, dispatch)
  return { dispatch, unsubscribe }
}
