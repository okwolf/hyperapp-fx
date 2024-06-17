import { assign } from "../utils.js";

const validCookieNameChars =
  "abdefghijklmnqrstuvxyzABDEFGHIJKLMNQRSTUVXYZ0123456789!#$%&'*+-.^_`|~";
const validCookieValueChars = validCookieNameChars + "()/:<>?@[]{}";

function nameEncoder(value) {
  return value
    .toString()
    .split("")
    .map(function (c) {
      return validCookieNameChars.indexOf(c) > -1 ? c : encodeURIComponent(c);
    })
    .join("");
}

function valueEncoder(value) {
  return value
    .toString()
    .split("")
    .map(function (c) {
      return validCookieValueChars.indexOf(c) > -1 ? c : encodeURIComponent(c);
    })
    .join("");
}

function writeCookie(name, value, attributes) {
  const attrs = Object.keys(attributes)
    .map(function (k) {
      return k + "=" + attributes[k];
    })
    .join(";");
  document.cookie = name + "=" + value + (attrs ? ";" + attrs : "");
}

function readCookieEffect(dispatch, props) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find(function (c) {
    return c.substr(0, c.indexOf("=")) === props.nameEncoder(props.name);
  });
  if (cookie) {
    const dispatchProps = assign({}, props.props || {});
    dispatchProps[props.prop || "value"] = props.converter(
      props.decoder(cookie.substr(props.nameEncoder(props.name).length + 1))
    );
    dispatch(props.action, dispatchProps);
  }
}

function writeCookieEffect(dispatch, props) {
  const name = (props.nameEncoder || nameEncoder)(props.name);
  const value = (props.encoder || valueEncoder)(props.converter(props.value));
  const attributes = {};
  if (props.ttl)
    props.expires = new Date(new Date().getTime() + props.ttl * 1000);
  if (props.path) attributes.path = props.path;
  if (props.domain) attributes.domain = props.domain;
  if (props.expires) attributes.expires = props.expires.toUTCString();

  writeCookie(name, value, attributes);
}

/**
 * Describes an effect that will read a cookie and then call an action with its value. If no `prop` is specified the action will receive the value of the cookie in the `value` prop. Extra properties may be added using by specifying `props`. If `json` is set to `true` the value will be converted from JSON.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {string} props.name - Name of the cookie
 * @param {string} props.action - Action to call when cookie is read
 * @param {string} props.prop - Name of prop to which the cookie value is passed
 * @param {object} props.props - Props to pass to action
 * @param {boolean} props.json - Indicates whether cookie value should be converted from JSON
 * @param {function} props.converter - Function used to convert cookie value
 * @param {function} props.decoder - Function used to decode cookie value
 * @example
 * import { ReadCookie } from "hyperapp-fx"
 *
 * const LoadPreferences = state => [
 *   state,
 *   ReadCookie({
 *     name: "preferences",
 *     action: function (state, { value }) {
 *       // this action will receive the cookie value
 *     },
 *     json: true
 *   })
 * ]
 */

export function ReadCookie(props) {
  return [
    readCookieEffect,
    assign(
      {
        nameEncoder: nameEncoder,
        converter:
          props.converter || props.json
            ? JSON.parse
            : function (v) {
                return v;
              },
        decoder: props.decoder || decodeURIComponent
      },
      props
    )
  ];
}

/**
 * Describes an effect that will write a cookie.
 *
 * @memberof module:fx
 * @param {object} props
 * @param {string} props.name - Name of the cookie
 * @param {string} props.value - Value to save in cookie
 * @param {string} props.domain - Domain of the cookie
 * @param {string} props.path - Path of the cookie
 * @param {date} props.expires - Expiry date of the cookie
 * @param {number} props.ttl - Time to live of the cookie in seconds, this property has precedence over the `expires` property
 * @param {boolean} props.json - Indicates whether the cookie value should be converted to JSON
 * @param {function} props.nameEncoder - Function used to encode the cookie name
 * @param {function} props.converter - Function used to convert cookie value
 * @param {function} props.encoder - Function used to encode cookie value
 * @example
 * import { WriteCookie } from "hyperapp-fx"
 *
 * const SavePreferences = state => [
 *   state,
 *   WriteCookie({
 *     name: "preferences",
 *     value: state.preferences
 *     json: true
 *   })
 * ]
 */

export function WriteCookie(props) {
  return [
    writeCookieEffect,
    assign(
      {
        converter:
          props.converter || props.json
            ? JSON.stringify
            : function (v) {
                return v;
              }
      },
      props
    )
  ];
}

/**
 * Describes an effect that will delete a cookie. 
 *
 * @memberof module:fx
 * @param {object} props
 * @param {string} props.name - Name of the cookie to delete

 * @example
 * import { DeleteCookie } from "hyperapp-fx"
 * 
 *  const ClearPreferences = state => [
 *   state,
 *   DeleteCookie({
 *     name: "preferences"
 *   })
 * ]
 */

export function DeleteCookie(props) {
  return WriteCookie(assign(props, { ttl: -1, value: "" }));
}
