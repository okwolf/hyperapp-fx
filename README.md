# Hyperapp Effects

[![Build Status](https://travis-ci.org/okwolf/hyperapp-effects.svg?branch=master)](https://travis-ci.org/okwolf/hyperapp-effects)
[![Codecov](https://img.shields.io/codecov/c/github/okwolf/hyperapp-effects/master.svg)](https://codecov.io/gh/okwolf/hyperapp-effects)
[![npm](https://img.shields.io/npm/v/hyperapp-effects.svg)](https://www.npmjs.org/package/hyperapp-effects)

A [Hyperapp](https://github.com/hyperapp/hyperapp) Higher-Order App giving your `app` superpowers of writing your [effects as data](https://youtu.be/6EdXaWfoslc), inspired by [Elm Commands](https://guide.elm-lang.org/architecture/effects).

## API

### `withEffects`

This Higher-Order App function enables `actions` to return arrays which will be treated as effects.

Example:

```js
import { withEffects } from "hyperapp-effects"

withEffects(app)({
  actions: {
    foo: () => [
      // ... effects go here
    ],
  }
}).foo())
```

### `action`

Describes an effect that will fire another action, optionally with `data`.

Example:

```js
import { action } from "hyperapp-effects"

actions: {
  foo: () => [
    action("bar", { message: "hello" }),
    action("baz", { message: "hola" }),
    // ... other effects
  ],
  bar: () => data => {
    // data will have { message: "hello" }
  },
  baz: () => data => {
    // data will have { message: "hola" }
  }
}
```

Note that you may also use a single effect without an array wrapper:

```js
import { action } from "hyperapp-effects"

actions: {
  foo: () => action("bar", { message: "hello" }),
  bar: () => data => {
    // data will have { message: "hello" }
  }
}
```

### `update`

Describes an effect that will update `state` immediately, useful for combining with effects that will change `state` later.

Example:

```js
import { update } from "hyperapp-effects"

actions: {
  foo: () => [
    update({ processing: true }),
    // ... other effects
  ]
}
```

### `frame`

Describes an effect that will call an action from inside [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), which is also where the render triggered by the action will run, optionally with a `data` object. A relative timestamp will be provided as the `time` property on the action `data`.

Example:

```js
import { frame } from "hyperapp-effects"

actions: {
  foo: () => [
    frame("spawn", { character: "goomba" }),
    // ... other effects
  ],
  spawn: () => data => {
    // This action is running inside requestAnimationFrame
    // data will have { time: xxxx, character: "goomba" }
  }
}
```

### `delay`

Describes an effect that will call an action after a delay using [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout), optionally with `data`.

Example:

```js
import { delay } from "hyperapp-effects"

actions: {
  startTimer: () => [
    delay(60000, "alarm", { name: "minute timer" }),
    // ... other effects
  ],
  alarm: () => data => {
    // This action will run after a minute delay
    // data will have { name: "minute timer" }
  }
}
```

### `time`

Describes an effect that will provide the current timestamp to an action using [`performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now), optionally with a `data` object. The timestamp will be provided as the `time` property on the action `data`.

Example:

```js
import { time } from "hyperapp-effects"

actions: {
  foo: () => [
    time("bar", { some: "data" }),
    // ... other effects
  ],
  bar: () => data => {
    // data will have { time: xxxx, some: "data" }
  }
}
```

### `log`

Describes an effect that will call [`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/Console/log) with arguments. Useful for development and debugging. Not recommended for production.

Example:

```js
import { log } from "hyperapp-effects"

actions: {
  foo: () => [
    log(
      "string arg",
      { object: "arg" },
      ["list", "of", "args"],
      someOtherArg
    ),
    // ... other effects
  ]
}
```

### `http`

Describes an effect that will send an HTTP request using [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) and then call an action with the response. If you are using a browser from the Proterozoic Eon like Internet Explorer you will want a [`fetch` polyfill](https://github.com/github/fetch). An optional `options` parameter supports the same [options as `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#Parameters) plus an additional `response` property specifying which [method to use on the response body](https://developer.mozilla.org/en-US/docs/Web/API/Body#Methods), defaulting to "json".

A simple HTTP GET request with a JSON response:

```js
import { http } from "hyperapp-effects"

actions: {
  foo: () => http("/data", "dataFetched"),
  dataFetched: () => data => {
    // data will have the JSON-decoded
    // response from /data
  }
}
```

An HTTP GET request with a text response:

```js
import { http } from "hyperapp-effects"

actions: {
  foo: () => http(
    "/data/name",
    "textFetched",
    { response: "text" }
  ),
  textFetched: () => data => {
    // data will have the response
    // text from /data
  }
}
```

An HTTP POST request using JSON body and response:

```js
import { http } from "hyperapp-effects"

actions: {
  foo: () => http(
    "/login",
    "loginResponse",
    {
      method: "POST",
      body: {
        user: "username",
        pass: "password"
      }
    }
  ),
  loginResponse: () => loginResponse => {
    // loginResponse will have the JSON-decoded
    // response from POSTing to /login
  }
}
```

## Proposed Future Effects

- `effects.throttle`
- `effects.random`