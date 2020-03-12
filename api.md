## Modules

<dl>
<dt><a href="#module_fx">fx</a></dt>
<dd></dd>
<dt><a href="#module_subs">subs</a></dt>
<dd></dd>
</dl>

<a name="module_fx"></a>

## fx

* [fx](#module_fx)
    * [.exports.Console(...args)](#module_fx.exports.Console)
    * [.exports.ReadCookie(props)](#module_fx.exports.ReadCookie)
    * [.exports.WriteCookie(props)](#module_fx.exports.WriteCookie)
    * [.exports.DeleteCookie(props)](#module_fx.exports.DeleteCookie)
    * [.exports.Debounce(props)](#module_fx.exports.Debounce)
    * [.exports.Dispatch(action)](#module_fx.exports.Dispatch)
    * [.exports.GetCurrentPosition(props)](#module_fx.exports.GetCurrentPosition)
    * [.exports.HistoryPush(props)](#module_fx.exports.HistoryPush)
    * [.exports.HistoryReplace(props)](#module_fx.exports.HistoryReplace)
    * [.exports.Http(props)](#module_fx.exports.Http)
    * [.exports.Merge(action)](#module_fx.exports.Merge)
    * [.exports.Random(props)](#module_fx.exports.Random)
    * [.exports.WriteToStorage(props)](#module_fx.exports.WriteToStorage)
    * [.exports.ReadFromStorage(props)](#module_fx.exports.ReadFromStorage)
    * [.exports.RemoveFromStorage(props)](#module_fx.exports.RemoveFromStorage)
    * [.exports.Throttle(props)](#module_fx.exports.Throttle)
    * [.exports.Now(props)](#module_fx.exports.Now)
    * [.exports.Delay(props)](#module_fx.exports.Delay)
    * [.exports.WebSocketSend(props)](#module_fx.exports.WebSocketSend)

<a name="module_fx.exports.Console"></a>

### fx.exports.Console(...args)
Describes an effect that will call [`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log) with arguments. Useful for development and debugging. Not recommended for production.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | arguments to log to the console |

**Example**  
```js
import { Console } from "hyperapp-fx"

const ConsoleAction = state => [
  state,
  Console(
    "string arg",
    { object: "arg" },
    ["list", "of", "args"],
    someOtherArg
  )
]
```
<a name="module_fx.exports.ReadCookie"></a>

### fx.exports.ReadCookie(props)
Describes an effect that will read a cookie and then call an action with its value. If no `prop` is specified the action will receive the value of the cookie in the `value` prop. Extra properties may be added using by specifying `props`. If `json` is set to `true` the value will be converted from JSON.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.name | <code>string</code> | Name of the cookie |
| props.action | <code>string</code> | Action to call when cookie is read |
| props.prop | <code>string</code> | Name of prop to which the cookie value is passed |
| props.props | <code>object</code> | Props to pass to action |
| props.json | <code>boolean</code> | Indicates whether cookie value should be converted from JSON |
| props.converter | <code>function</code> | Function used to convert cookie value |
| props.decoder | <code>function</code> | Function used to decode cookie value |

**Example**  
```js
import { ReadCookie } from "hyperapp-fx"

const LoadPreferences = state => [
  state,
  ReadCookie({
    name: "preferences",
    action: function (state, { value }) {
      // this action will receive the cookie value
    },
    json: true
  })
]
```
<a name="module_fx.exports.WriteCookie"></a>

### fx.exports.WriteCookie(props)
Describes an effect that will write a cookie.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.name | <code>string</code> | Name of the cookie |
| props.value | <code>string</code> | Value to save in cookie |
| props.domain | <code>string</code> | Domain of the cookie |
| props.path | <code>string</code> | Path of the cookie |
| props.expires | <code>date</code> | Expiry date of the cookie |
| props.ttl | <code>number</code> | Time to live of the cookie in seconds, this property has precedence over the `expires` property |
| props.json | <code>boolean</code> | Indicates whether the cookie value should be converted to JSON |
| props.nameEncoder | <code>function</code> | Function used to encode the cookie name |
| props.converter | <code>function</code> | Function used to convert cookie value |
| props.encoder | <code>function</code> | Function used to encode cookie value |

**Example**  
```js
import { WriteCookie } from "hyperapp-fx"

const SavePreferences = state => [
  state,
  WriteCookie({
    name: "preferences",
    value: state.preferences
    json: true
  })
]
```
<a name="module_fx.exports.DeleteCookie"></a>

### fx.exports.DeleteCookie(props)
Describes an effect that will delete a cookie.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.name | <code>string</code> | Name of the cookie to delete |

**Example**  
```js
import { DeleteCookie } from "hyperapp-fx"

 const ClearPreferences = state => [
  state,
  DeleteCookie({
    name: "preferences"
  })
]
```
<a name="module_fx.exports.Debounce"></a>

### fx.exports.Debounce(props)
Describes an effect that will call an action after waiting for a delay to pass. The delay will be reset each time the action is called.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.wait | <code>number</code> | delay to wait before calling the action |
| props.action | <code>\*</code> | action to debounce |

**Example**  
```js
import { Debounce } from "hyperapp-fx"

const OriginalAction = state => {
  // This action will run after waiting for 500ms since the last call
}

const DebouncedAction = state => [
  state,
  Debounce({
    wait: 500,
    action: OriginalAction
  })
]
```
<a name="module_fx.exports.Dispatch"></a>

### fx.exports.Dispatch(action)
Describes an effect that will dispatch whatever action is passed to it. Useful for batching actions and FX together.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>\*</code> | an action to dispatch |

**Example**  
```js
import { Dispatch } from "hyperapp-fx"

const BatchedFxAndActions = state => [
  state,
  SomeFx,
  Dispatch(SomeAction)
]
```
<a name="module_fx.exports.GetCurrentPosition"></a>

### fx.exports.GetCurrentPosition(props)
Describes an effect that will get the current user's location using the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) and then call an action with the coordinates.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.action | <code>\*</code> | Action to call with the position |
| props.error | <code>\*</code> | Action to call if there is a problem getting the position |
| props.options | <code>object</code> | An optional [`PositionOptions`](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) object |

**Example**  
```js
import { GetCurrentPosition } from "hyperapp-fx"

const WhereAmI = state => [
  state,
  GetCurrentPosition({
    action(state, position) {
      console.log(position);
    },
    error(state, error) {
      // please handle your errors...
    }
  })
]
```
<a name="module_fx.exports.HistoryPush"></a>

### fx.exports.HistoryPush(props)
Describes an effect that will add an entry to the browsers navigation [`history`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries) with the supplied location and state.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.state | <code>\*</code> | data to add to browser history |
| props.url | <code>string</code> | url to add to browser history |
| props.title | <code>string</code> | title to set document to |

**Example**  
```js
import { HistoryPush } from "hyperapp-fx"

export const UpdateHistory = state => [
  state,
  HistoryPush({
    state,
    title: document.title,
    url: '#foo'
  })
]
```
<a name="module_fx.exports.HistoryReplace"></a>

### fx.exports.HistoryReplace(props)
Describes an effect that will replace the browsers current [`history`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries) navigation entry with the supplied location and state.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.state | <code>\*</code> | data to add to browser history |
| props.url | <code>string</code> | url to add to browser history |
| props.title | <code>string</code> | title to set document to |

**Example**  
```js
import { HistoryReplace } from "hyperapp-fx"

export const InitialiseHistory = state => [
  state,
  HistoryReplace({
    state,
    title: document.title,
    url: '#foo'
  })
]
```
<a name="module_fx.exports.Http"></a>

### fx.exports.Http(props)
Describes an effect that will send an HTTP request using [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) and then call an action with the response. If you are using a browser from the Proterozoic Eon like Internet Explorer you will want one of the [available](https://github.com/developit/unfetch) `fetch` [polyfills](https://github.com/github/fetch).

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.url | <code>string</code> | URL for sending HTTP request |
| props.options | <code>object</code> | same [options as `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#Parameters) |
| props.response | <code>string</code> | Specify which method to use on the response body, defaults to `"json"`, other [supported methods](https://developer.mozilla.org/en-US/docs/Web/API/Response#Methods) include `"text"` |
| props.action | <code>\*</code> | Action to call with the results of a successful HTTP response |
| props.error | <code>\*</code> | Action to call if there is a problem making the request or a not-ok HTTP response, defaults to the same action defined for success |

**Example**  
```js
import { Http } from "hyperapp-fx"

const Login = state => [
  state,
  Http({
    url: "/login",
    options: {
      method: "POST",
      body: form
    },
    action(state, loginResponse) {
      // loginResponse will have the JSON-decoded response from POSTing to /login
    },
    error(state, error) {
      // please handle your errors...
    }
  })
]
```
<a name="module_fx.exports.Merge"></a>

### fx.exports.Merge(action)
Describes an effect that will shallow-merge the results from actions that return partial state.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>function</code> | an action function that takes state and returns a partial new state which will be shallow-merged with the previous state |

**Example**  
```js
import { Merge } from "hyperapp-fx"

const MergingAction = state => [
  state,
  Merge(ActionReturningPartialState)
]
```
<a name="module_fx.exports.Random"></a>

### fx.exports.Random(props)
Describes an effect that will call an action with one or more randomly generated value(s).
If provided the range for [random numeric values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) will be `[min, max)` or else the default range is `[0, 1)`. Also `bool`eans, `int`egers, and arrays of `values` are supported. The random value will be provided as the action `data`.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.action | <code>\*</code> | action to call with the random number result |
| props.min | <code>number</code> | minimum random number to generate |
| props.max | <code>number</code> | maximum random number to generate |
| props.int | <code>boolean</code> | round number to nearest integer |
| props.bool | <code>boolean</code> | generate a boolean instead of a number (ignores numeric options) |
| props.values | <code>array(object)</code> | generate an array of values (ignores other options, each object accepts same props as the root) |

**Example**  
```js
import { Random } from "hyperapp-fx"

const RollDie = state => [
  state,
  Random({
    min: 1,
    max: 6,
    int: true,
    action: (_, roll) => {
      // roll will be an int from 1-6

      // return new state using roll
    }
  })
]
```
<a name="module_fx.exports.WriteToStorage"></a>

### fx.exports.WriteToStorage(props)
Describes an effect that will write a key value pair to Storage. By default the item is written to [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), to write to [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) set the `storage` prop to `session`. Values are saved in JSON, unless a custom converter is provided.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.key | <code>string</code> | Specify key to use |
| props.value | <code>\*</code> | Value to write to storage |
| props.storage | <code>string</code> | Storage area to write to, can be either "session" or "local" |
| props.converter | <code>function</code> | Use a custom converter function to encode the value of the item |

**Example**  
```js
import { WriteToStorage } from "hyperapp-fx"

const SavePreferences = (state, preferences) => [
  state,
  WriteToStorage({
    key: "preferences",
    value: preferences,
    storage: "local"
  })
]
```
<a name="module_fx.exports.ReadFromStorage"></a>

### fx.exports.ReadFromStorage(props)
Describes an effect that will read the value of a key from Storage. By default the item is read from [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), to read from [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) set the `storage` prop to `session`. Values are converted from JSON, unless a custom converter is provided.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.key | <code>string</code> | Specify key to use with which to write to storage |
| props.action | <code>\*</code> | Action to call with the value of the item in storage |
| props.storage | <code>string</code> | Storage area to read from, can be either "session" or "local" |
| props.prop | <code>string</code> | Property of the action where the value is received, defaults to "value" |
| props.converter | <code>function</code> | Use a custom converter function to decode the value of the item |

**Example**  
```js
import { ReadFromStorage } from "hyperapp-fx"

const LoadPreferences = state => [
 state,
 ReadFromStorage({
   key: "preferences",
   action: function (state, { value }) {
     // this action will receive the value of the item in storage
   }
 })
]
```
<a name="module_fx.exports.RemoveFromStorage"></a>

### fx.exports.RemoveFromStorage(props)
Describes an effect that will remove a key value pair Storage. By default the item is deleted from [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), to delete from [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) set the `storage` prop to `session`.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.key | <code>string</code> | Specify key to delete from storage |
| props.storage | <code>string</code> | Storage area to delete from, can be either "session" or "local" |

**Example**  
```js
import { RemoveFromStorage } from "hyperapp-fx"

const ClearPreferences = state => [
 state,
 RemoveFromStorage({
   key: "preferences",
   storage: "local"
 })
]
```
<a name="module_fx.exports.Throttle"></a>

### fx.exports.Throttle(props)
Describes an effect that will call an action at a maximum rate. Where `rate` is one call per `rate` milliseconds.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.rate | <code>number</code> | minimum time between action calls |
| props.action | <code>\*</code> | action to throttle |

**Example**  
```js
import { Throttle } from "hyperapp-fx"

const OriginalAction = state => {
  // This action will only run once per 500ms
}

const ThrottledAction = state => [
  state,
  Throttle({
    rate: 500,
    action: OriginalAction
  })
]
```
<a name="module_fx.exports.Now"></a>

### fx.exports.Now(props)
Describes an effect that provides the current timestamp (using [`performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)) or current date (using [`new Date()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Syntax)). The timestamp/date will be provided as the action `data`.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.asDate | <code>boolean</code> | use a Date object instead of a timestamp |
| props.action | <code>\*</code> | action to call with the timestamp/date |

**Example**  
```js
import { Now } from "hyperapp-fx"

const NowAction = state => [
  state,
  Now({
    asDate: true,
    action(currentDate) {
    }
  })
]
```
<a name="module_fx.exports.Delay"></a>

### fx.exports.Delay(props)
Describes an effect that provides a timestamp (using [`performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)) or date (using [`new Date()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Syntax)) after a delay. The timestamp/date will be provided as the action `data`.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.wait | <code>number</code> | delay to wait before calling action |
| props.asDate | <code>boolean</code> | use a Date object instead of a timestamp |
| props.action | <code>\*</code> | action to call with the timestamp/date |

**Example**  
```js
import { Delay } from "hyperapp-fx"

const DelayedAction = state => [
  state,
  Delay({
    wait: 500,
    action() {
      // This action will run after a 500ms delay
    }
  })
]
```
<a name="module_fx.exports.WebSocketSend"></a>

### fx.exports.WebSocketSend(props)
Describes an effect that will open a [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) connection for a given URL (and optional protocols) and send a message reusing existing connections.

**Kind**: static method of [<code>fx</code>](#module_fx)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.url | <code>string</code> | The URL to which to connect; this should be the URL to which the WebSocket server will respond |
| props.protocols | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified `protocol`). If you don't specify a protocol string, an empty string is assumed. |
| props.data | <code>\*</code> | data to send once connected |

**Example**  
```js
import { WebSocketSend } from "hyperapp-fx"

 const SendAction = state => [
  state,
  WebSocketSend({
    url: "wss://example.com",
    data: JSON.stringify({
      sendThisData: "on connecting"
    })
  })
]
```
<a name="module_subs"></a>

## subs

* [subs](#module_subs)
    * [.exports.Animation(action)](#module_subs.exports.Animation)
    * [.exports.WatchPosition(props)](#module_subs.exports.WatchPosition)
    * [.exports.HistoryPop(action)](#module_subs.exports.HistoryPop)
    * [.exports.Keyboard(props)](#module_subs.exports.Keyboard)
    * [.exports.Interval(props)](#module_subs.exports.Interval)
    * [.exports.WebSocketListen(props)](#module_subs.exports.WebSocketListen)

<a name="module_subs.exports.Animation"></a>

### subs.exports.Animation(action)
Describes an effect that will call an action from inside a [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) loop, which is also where the render triggered by the action will run.
A relative timestamp will be provided as the action `data`.

**Kind**: static method of [<code>subs</code>](#module_subs)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>\*</code> | action to call inside a requestAnimationFrame loop |

**Example**  
```js
import { h, app } from "hyperapp"
import { Animation, Merge } from "hyperapp-fx"

const UpdateTime = time => ({ time: lastTime, delta: lastDelta }) => ({
  time,
  delta: time && lastTime ? time - lastTime : lastDelta
})

const AnimationFrame = (state, time) => [
  state,
  Merge(UpdateTime(time)),
  Merge(UpdateStateForDelta),
  Merge(UpdateMoreStateForDelta),
  // ...
]

app({
  init: {
    time: 0,
    delta: 0,
    running: true
  }
  // ...
  subscriptions: ({ running }) => (running ? [Animation(AnimationFrame)] : [])
})
```
<a name="module_subs.exports.WatchPosition"></a>

### subs.exports.WatchPosition(props)
Describes an effect that can monitor geolocation using the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API), sending updates each time the location is updated

**Kind**: static method of [<code>subs</code>](#module_subs)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.action | <code>\*</code> | required action to call each time the location changes |
| props.error | <code>\*</code> | optional action to call on error |
| props.options | <code>object</code> | An optional [`PositionOptions`](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) object |

**Example**  
```js
import { WatchPosition } from "hyperapp-fx"

const GeoSub = WatchPosition({
  action: (state, position) => {
    state.user_location = position.coords,
  }
})
```
<a name="module_subs.exports.HistoryPop"></a>

### subs.exports.HistoryPop(action)
Describes an effect that will call an action whenever a user navigates through their browser [`history`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView/popstate_event). The action will receive the state at that point in the browsers history.

**Kind**: static method of [<code>subs</code>](#module_subs)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>\*</code> | Action to call |

**Example**  
```js
import { h, app } from "hyperapp"
import { HistoryPop } from "hyperapp-fx"

app({
  init: { page: 1 },
  view: state => <App page={state.page} />,
  container: document.body,
  subscriptions: state => [
    HistoryPop({ action: (state, event) => event.state || state })
  ]
})
```
<a name="module_subs.exports.Keyboard"></a>

### subs.exports.Keyboard(props)
Describes an effect that can capture [keydown](https://developer.mozilla.org/en-US/docs/Web/Events/keydown), [keyup](https://developer.mozilla.org/en-US/docs/Web/Events/keyup), and [keypress](https://developer.mozilla.org/en-US/docs/Web/Events/keypress) events for your entire document. The [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) will be provided as the action `data`.

**Kind**: static method of [<code>subs</code>](#module_subs)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.downs | <code>boolean</code> | listen for keydown events |
| props.ups | <code>boolean</code> | listen for keyup events |
| props.presses | <code>boolean</code> | listen for keypress events |
| props.action | <code>\*</code> | action to call when keyboard events are fired |

**Example**  
```js
import { Keyboard } from "hyperapp-fx"

const KeySub = Keyboard({
  downs: true,
  ups: true,
  action: (_, keyEvent) => {
    // keyEvent has the props of the KeyboardEvent
    // action will be called for keydown and keyup
  }
})
```
<a name="module_subs.exports.Interval"></a>

### subs.exports.Interval(props)
Describes an effect that provides a timestamp (using [`performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)) or date (using [`new Date()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Syntax)) at a regular interval. The timestamp/date will be provided as the action `data`.

**Kind**: static method of [<code>subs</code>](#module_subs)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.asDate | <code>boolean</code> | use a Date object instead of a timestamp |
| props.every | <code>number</code> | get the time repeatedly after waiting a set interval |
| props.action | <code>\*</code> | action to call with the timestamp/date |

**Example**  
```js
import { h, app } from "hyperapp"
import { Now, Interval } from "hyperapp-fx"

const UpdateDate = (_, date) =>
  date.toLocaleString("uk", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  })

const InitialTime = Now({
  asDate: true,
  action: UpdateDate
})

const TimeSub = Interval({
  every: 100,
  asDate: true,
  action: UpdateDate
})

app({
  init: ["", InitialTime],
  view: time => <h1>{time}</h1>,
  container: document.body,
  subscriptions: () => [TimeSub]
})
```
<a name="module_subs.exports.WebSocketListen"></a>

### subs.exports.WebSocketListen(props)
Describes an effect that will open a [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) connection for a given URL and optional protocols. Connections will remain open until the last subscription for that URL are cancelled.

**Kind**: static method of [<code>subs</code>](#module_subs)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>object</code> |  |
| props.url | <code>string</code> | The URL to which to connect; this should be the URL to which the WebSocket server will respond |
| props.protocols | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Either a single protocol string or an array of protocol strings. These strings are used to indicate sub-protocols, so that a single server can implement multiple WebSocket sub-protocols (for example, you might want one server to be able to handle different types of interactions depending on the specified `protocol`). If you don't specify a protocol string, an empty string is assumed. |
| props.action | <code>\*</code> | action to call with new incoming messages |
| props.error | <code>\*</code> | action to call if an error occurs |

**Example**  
```js
import { WebSocketListen } from "hyperapp-fx"

const WebSocketSub = WebSocketListen({
  url: "wss://example.com",
  action: ReceivedMessageAction
})
```
