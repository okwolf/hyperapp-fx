# Hyperapp FX

[![Build Status](https://github.com/okwolf/hyperapp-fx/actions/workflows/ci.yml/badge.svg)](https://github.com/okwolf/hyperapp-fx/actions)
[![Codecov](https://img.shields.io/codecov/c/github/okwolf/hyperapp-fx/master.svg)](https://codecov.io/gh/okwolf/hyperapp-fx)
[![npm](https://img.shields.io/npm/v/hyperapp-fx.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/hyperapp-fx)

A handy set of effects for use with [Hyperapp](https://github.com/jorgebucaran/hyperapp).

## Getting Started

Here's a taste of how to use a common effect for making HTTP requests. The app displays inspiring quotes about design, fetching a new quote each time the user clicks on the current one. Go ahead and [try it online here](https://codepen.io/okwolf/pen/vPbMaa?editors=0010).

```js
import { app, h, text } from "hyperapp";
import { Http } from "hyperapp-fx";

const GetQuote = () => [
  "...",
  Http({
    url: "https://api.quotable.io/random",
    action: (_, { content }) => content
  })
];

app({
  init: "Click here for quotes",
  view: quote => h("h1", { onclick: GetQuote }, text(quote)),
  node: document.getElementById("app")
});
```

More [examples](https://github.com/okwolf/hyperapp-playground) are available to show other effects in action.

## Installation

<pre>
npm i <a href=https://www.npmjs.com/package/hyperapp-fx>hyperapp-fx</a>
</pre>

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org), use as you would anything else.

```js
import { Http } from "hyperapp-fx";
```

If you don't want to set up a build environment, you can import Hyperapp FX from a CDN like [esm.sh](https://esm.sh/hyperapp-fx). We support all modern browsers used by at least 1% of the world.

```js
import { Http } from "https://esm.sh/hyperapp-fx";
```

## [API documentation](api.md)

## License

Hyperapp FX is MIT licensed. See [LICENSE](LICENSE.md).
