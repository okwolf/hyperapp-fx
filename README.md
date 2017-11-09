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
  ]
}
```

Note that you may also use a single effect without an array wrapper:

```js
import { action } from "hyperapp-effects"

actions: {
  foo: () => action("bar", { message: "hello" })
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

Describes an effect that will call an action from inside [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), which is also where the render triggered by the action will run, optionally with `data`. A relative timestamp will be provided as the `time` property on the action `data`.

Example:

```js
import { frame } from "hyperapp-effects"

actions: {
  foo: () => [
    frame("spawn", { character: "goomba" }),
    // ... other effects
  ]
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
  ]
}
```

### `time`

Describes an effect that will provide the current timestamp to an action using [`performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now), optionally with `data`. The timestamp will be provided as the `time` property on the action `data`.

Example:

```js
import { time } from "hyperapp-effects"

actions: {
  foo: () => [
    time("bar", { some: "data" }),
    // ... other effects
  ]
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

## Proposed Future Effects

- `effects.http`
- `effects.throttle`
- `effects.random`