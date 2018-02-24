# <img height=24 src=https://cdn.rawgit.com/JorgeBucaran/f53d2c00bafcf36e84ffd862f0dc2950/raw/882f20c970ff7d61aa04d44b92fc3530fa758bc0/Hyperapp.svg> Hyperapp FX

[![Build Status](https://travis-ci.org/hyperapp/fx.svg?branch=master)](https://travis-ci.org/hyperapp/fx)
[![codecov](https://codecov.io/gh/hyperapp/fx/branch/master/graph/badge.svg)](https://codecov.io/gh/hyperapp/fx)
[![npm](https://img.shields.io/npm/v/@hyperapp/fx.svg)](https://www.npmjs.org/package/@hyperapp/fx)

A [Hyperapp](https://github.com/hyperapp/hyperapp) Higher-Order App giving your `app` superpowers to write your [effects as data](https://youtu.be/6EdXaWfoslc), inspired by [Elm Commands](https://guide.elm-lang.org/architecture/effects).

## Installation

### Node.js

Install with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/@hyperapp/fx">@hyperapp/fx</a>
</pre>

Then with a module bundler like [parcel](https://github.com/parcel-bundler/parcel), [rollup](https://github.com/rollup/rollup) or [webpack](https://github.com/webpack/webpack), use as you would anything else.

```js
import { withFx } from "@hyperapp/fx"
```

Or using require.

```js
const { withFx } = require("@hyperapp/fx")
```

### Browser

Download the minified library from the [CDN](https://unpkg.com/@hyperapp/fx).

```html
<script src="https://unpkg.com/@hyperapp/fx"></script>
```

You can find the library in `window.fx`.

## API

### Effects data

```js
EffectTuple = [type: string, props: object]
Effect = EffectTuple | EffectTuple[] | Effect[]
```

Effects are always represented as arrays. For a single effect this array represents a tuple containing the effect type string and an object containing the properties of this effect. For multiple effects each array element is either an effect tuple or an array of these tuples, which may be nested. This means that effects are composeable.

### `withFx`

```js
EffectsConfig = {
  [effectName]: (
    props: object,
    getAction: (name: string) => Action
  ) => undefined
}
withFx = App => App | EffectsConfig => App => App
```

This Higher-Order App function enables `actions` to return arrays which later will be run as effects.

Example:

```js
import { withFx } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  foo: () => [
    // ... effects go here
  ],
  bar: () => // or a single effect can go here
}

withFx(app)(state, actions).foo()
```

For custom effects pass an object to `withFx` before composing with your `app`:

```js
import { withFx } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  // You will probably want to write a helper function for returning these
  // similar to the built-in effects
  foo: () => [
    // type of effect for effects data
    // must match key used in custom effect object below
    "custom",
    {
      // ... props go here
    }
  ]
}

withFx({
  // key in this object must match type used in effect data above
  custom(props, getAction) {
    // use props to get the props used when creating the effect
    // use getAction for firing actions when appropriate
  }
})(app)(state, actions).foo()
```

Reusing an existing effect type will override the built-in one.

### `action`

```js
action = (name: string, data?: any) => EffectTuple
```

Describes an effect that will fire another action, optionally with `data`.

Example:

```js
import { withFx, action } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  foo: () => [
    action("bar", { message: "hello" }),
    action("baz", { message: "hola" }),
    // ... other effects
  ],
  bar: data => {
    // data will have { message: "hello" }
  },
  baz: data => {
    // data will have { message: "hola" }
  }
}

withFx(app)(state, actions).foo()
```

Note that you may also use a single action effect without an array wrapper and that nested `actions` may be called by separating the slices with dots:

```js
import { withFx, action } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  foo: () => action("bar.baz", { message: "hello" }),
  bar: {
    baz: data => {
      // data will have { message: "hello" }
    }
  }
}

withFx(app)(state, actions).foo()
```

This same convention follows for all the other effects as well.

Also note that `action` (and other effects) may be used for handler props in your `view`:

```js
import { withFx, action } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  foo: data => {
    // data will have { message: "hello" }
    // when the button is clicked
  }
}

const view = () => h("button", {
  onclick: action("foo", { message: "hello" })
})

withFx(app)(state, actions, view, document.body)
```

### `frame`

```js
frame = (action: string) => EffectTuple
```

Describes an effect that will call an action from inside [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), which is also where the render triggered by the action will run. A relative timestamp will be provided as the action `data`. If you wish to have an action that continuously updates the `state` and rerenders inside of `requestAnimationFrame` (such as for a game), remember to include another `frame` effect in your return.

Example:

```js
import { withFx, action, frame } from "@hyperapp/fx"

const state = {
  time: 0,
  delta: 0
}

const actions = {
  init: () => frame("update"),
  update: time => [
    action("incTime", time),

    // ...
    // Other actions to update the state based on delta time
    // ...

    // End with a recursive frame effect to perform the next update
    frame("update")
  ],
  incTime: time => ({ time: lastTime, delta: lastDelta }) => ({
    time,
    delta: time && lastTime ? time - lastTime : lastDelta
  })
}

withFx(app)(state, actions).init()
```

### `delay`

```js
delay = (duration: number, action: string, data?: any) => EffectTuple
```

Describes an effect that will call an action after a delay using [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout), optionally with `data`.

Example:

```js
import { withFx, delay } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  startTimer: () => delay(
    60000,
    "alarm",
    { name: "minute timer" }
  ),
  alarm: data => {
    // This action will run after a minute delay
    // data will have { name: "minute timer" }
  }
}

withFx(app)(state, actions).startTimer()
```

### `time`

```js
time = (action: string) => EffectTuple
```

Describes an effect that will provide the current timestamp to an action using [`performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now). The timestamp will be provided as the action `data`.

Example:

```js
import { withFx, time } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  foo: () => time("bar"),
  bar: timestamp => {
    // use timestamp
  }
}

withFx(app)(state, action).foo()
```

### `log`

```js
log = (...args: any[]) => EffectTuple
```

Describes an effect that will call [`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log) with arguments. Useful for development and debugging. Not recommended for production.

Example:

```js
import { withFx, log } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  foo: () => log(
    "string arg",
    { object: "arg" },
    ["list", "of", "args"],
    someOtherArg
  )
}

withFx(app)(state, actions).foo()
```

### `http`

```js
http = (url: string, action: string, options?: object) => EffectTuple
```

Describes an effect that will send an HTTP request using [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) and then call an action with the response. If you are using a browser from the Proterozoic Eon like Internet Explorer you will want a [`fetch` polyfill](https://github.com/github/fetch). An optional `options` parameter supports the same [options as `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#Parameters) plus the following additional properties:

| Property   | Usage                                                                                                                                              | Default                            |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| `response` | Specify which [method to use on the response body](https://developer.mozilla.org/en-US/docs/Web/API/Body#Methods).                                 | `"json"`                           |
| `error`    | Action to call if there is a problem making the request or a [not-ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok) HTTP response. | Same action as defined for success |

Example HTTP GET request with a JSON response:

```js
import { withFx, http } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  foo: () => http("/data", "dataFetched"),
  dataFetched: data => {
    // data will have the JSON-decoded response from /data
  }
}

withFx(app)(state, actions).foo()
```

Example HTTP GET request with a text response:

```js
import { withFx, http } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  foo: () => http(
    "/data/name",
    "textFetched",
    { response: "text" }
  ),
  textFetched: data => {
    // data will have the response text from /data
  }
}

withFx(app)(state, actions).foo()
```

Example HTTP POST request using JSON body and response that handles errors:

```js
import { withFx, http } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  login: form => http(
    "/login",
    "loginComplete",
    {
      method: "POST",
      body: form,
      error: "loginError"
    }
  ),
  loginComplete: loginResponse => {
    // loginResponse will have the JSON-decoded response from POSTing to /login
  },
  loginError: error => {
    // please handle your errors...
  }
}

withFx(app)(state, actions).login()
```

### `event`

```js
event = (action: string) => EffectTuple
```

Describes an effect that will capture [DOM Event](https://developer.mozilla.org/en-US/docs/Web/Events) data when attached to a handler in your `view`. The originally fired event will be provided as the action `data`.

```js
import { withFx, event } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  click: clickEvent => {
    // clickEvent has the props of the click event
  }
}

const view = () => h("button", {
  onclick: event("click")
})

withFx(app)(state, actions, view, document.body)
```

### `keydown`

```js
keydown = (action: string) => EffectTuple
```

Describes an effect that will capture [keydown](https://developer.mozilla.org/en-US/docs/Web/Events/keydown) events for your entire document. The [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) will be provided as the action `data`.

Example:

```js
import { withFx, keydown } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  init: () => keydown("keyPressed"),
  keyPressed: keyEvent => {
    // keyEvent has the props of the KeyboardEvent
  }
}

withFx(app)(state, actions).init()
```

### `keyup`

```js
keyup = (action: string) => EffectTuple
```

Describes an effect that will capture [keyup](https://developer.mozilla.org/en-US/docs/Web/Events/keyup) events for your entire document. The [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) will be provided as the action `data`.

Example:

```js
import { withFx, keyup } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  init: () => keyup("keyReleased"),
  keyReleased: keyEvent => {
    // keyEvent has the props of the KeyboardEvent
  }
}

withFx(app)(state, actions).init()
```

### `random`

```js
random = (action: string, min?: number, max?: number) => EffectTuple
```

Describes an effect that will call an action with a [randomly generated number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) within a range. If provided the range will be `[min, max)` or else the default range is `[0, 1)`. The random number will be provided as the action `data`.

Use [`Math.floor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor) if you want a random integer instead of a floating-point number. Remember the range will be `max` exclusive, so use your largest desired int + 1.

Example:

```js
import { withFx, random } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  // We use the max of 7 to include all values of 6.x
  foo: () => random("rollDie", 1, 7),
  rollDie: randomNumber => {
    const roll = Math.floor(randomNumber)
    // roll will be an int from 1-6
  }
}

withFx(app)(state, actions).foo()
```

### `effectsIf`

```js
EffectConditional = [boolean, EffectTuple]
effectsIf = EffectConditional[] => EffectTuple[]
```

Convert an array of `[boolean, EffectTuple]`s into a new array of effects where the boolean evaluated to true. This provides compact syntatic sugar for conditionally firing effects.

Example:

```js
import { withFx, effectsIf, action } from "@hyperapp/fx"

const state = {
  // ...
}

const actions = {
  foo: () => ({ running }) => effectsIf([
    [true, action("always")],
    [false, action("never")],
    [running, action("ifRunning")],
    [!running, action("ifNotRunning")]
  ])
}

withFx(app)(state, actions).foo()
```

## License

Hyperapp Effects is MIT licensed. See [LICENSE](LICENSE.md).