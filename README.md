# Hyperapp Effects

## API

### Implemented

#### `effects.action`

Fires another action, optionally with `data`.

Example:

```js
actionName: () => [
  effects.action("foo", { message: "hello" }),
  // ... other effects
]
```

#### `effects.update`

Updates `state` immediately, useful for combining with effects that will change `state` later.

Example:

```js
actionName: () => [
  effects.update({ processing: true }),
  // ... other effects
]
```

#### `effect.frame`

Calls an action from inside `requestAnimationFrame`, which is also where the render triggered by the action will run, optionally with `data`.

Example:

```js
actionName: () => [
  effects.frame("spawn", { character: "goomba" }),
  // ... other effects
]
```

#### `effects.delay`

Calls an action after a delay using `setTimeout`, optionally with `data`.

Example:

```js
actionName: () => [
  effects.delay(60000, "alarm", { name: "minute timer" }),
  // ... other effects
]
```

### Proposed

#### `effects.http`

#### `effects.time`

#### `effects.random`

#### `effects.log`