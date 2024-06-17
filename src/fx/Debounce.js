const debounceTimeouts = [];
function debounceEffect(dispatch, props) {
  let timeout = debounceTimeouts.find(function (nextTimeout) {
    return nextTimeout[0] === props.action;
  });
  if (!timeout) {
    timeout = [props.action];
    debounceTimeouts.push(timeout);
  } else {
    clearTimeout(timeout[1]);
  }

  timeout[1] = setTimeout(function () {
    dispatch(props.action);
  }, props.wait);
}

/**
 * Describes an effect that will call an action after waiting for a delay to pass. The delay will be reset each time the action is called.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {number} props.wait - delay to wait before calling the action
 * @param {*} props.action - action to debounce
 * @example
 * import { Debounce } from "hyperapp-fx"
 *
 * const OriginalAction = state => {
 *   // This action will run after waiting for 500ms since the last call
 * }
 *
 * const DebouncedAction = state => [
 *   state,
 *   Debounce({
 *     wait: 500,
 *     action: OriginalAction
 *   })
 * ]
 */
export function Debounce(props) {
  return [debounceEffect, props];
}
