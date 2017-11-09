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

Fires another action, optionally with `data`.

Example:

```js
import { action } from "hyperapp-effects"

actionName: () => [
  action({
    name: "foo",
    data: { message: "hello" }
  }),
  // ... other effects
]
```

### `update`

Updates `state` immediately, useful for combining with effects that will change `state` later.

Example:

```js
import { update } from "hyperapp-effects"

actionName: () => [
  update({ state: { processing: true } }),
  // ... other effects
]
```

### `frame`

Calls an action from inside [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame), which is also where the render triggered by the action will run, optionally with `data`.

Example:

```js
import { frame } from "hyperapp-effects"

actionName: () => [
  frame({
    action: "spawn",
    data: { character: "goomba" }
  }),
  // ... other effects
]
```

### `delay`

Calls an action after a delay using [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout), optionally with `data`.

Example:

```js
import { delay } from "hyperapp-effects"

actionName: () => [
  delay({
    duration: 60000,
    action: "alarm",
    data: { name: "minute timer" }
  }),
  // ... other effects
]
```

## Proposed Future Effects

- `effects.http`
- `effects.time`
- `effects.throttle`
- `effects.random`
- `effects.log`