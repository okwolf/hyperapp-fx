export function BatchFx() {
  var fx = arguments
  return {
    effect: function(_, dispatch) {
      for (var i = 0; i < fx.length; i++) {
        fx[i].effect(fx[i].props, dispatch)
      }
    }
  }
}
