# Hyperapp Effects

## API

### Implemented

#### `effects.Action`

Fires another action, optionally with `data`.

Example:

```js
import { Action } from "hyperapp-effects"

actionName: () => [
  Action({ name: "foo", data: { message: "hello" } }),
  // ... other effects
]
```

#### `effects.Update`

Updates `state` immediately, useful for combining with effects that will change `state` later.

Example:

```js
import { Update } from "hyperapp-effects"

actionName: () => [
  Update({ state: { processing: true } }),
  // ... other effects
]
```

#### `effect.Frame`

Calls an action from inside `requestAnimationFrame`, which is also where the render triggered by the action will run, optionally with `data`.

Example:

```js
import { Frame } from "hyperapp-effects"

actionName: () => [
  Frame({ action: "spawn", data: { character: "goomba" } }),
  // ... other effects
]
```

#### `effects.Delay`

Calls an action after a delay using `setTimeout`, optionally with `data`.

Example:

```js
import { Delay } from "hyperapp-effects"

actionName: () => [
  Delay({
    duration: 60000,
    action: "alarm",
    data: { name: "minute timer" }
  }),
  // ... other effects
]
```

### Proposed

#### `effects.http`

#### `effects.time`

#### `effects.random`

#### `effects.log`