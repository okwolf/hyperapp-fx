// special property used to disambiguate action dispatch data from a new state value
// inspired by https://github.com/reactjs/redux/blob/3b600993e91d42d1569994964e9a13606edccdf0/src/utils/actionTypes.js#L9-L14
export var INTERNAL_DISPATCH =
  "@@fx/DISPATCH" +
  Math.random()
    .toString(36)
    .substring(7)
    .split("")
    .join(".")

export var INTERNAL_COMMAND =
  "@@fx/COMMAND" +
  Math.random()
    .toString(36)
    .substring(7)
    .split("")
    .join(".")
