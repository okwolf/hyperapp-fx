# Hyperapp FX

[![Build Status](https://travis-ci.org/okwolf/hyperapp-fx.svg?branch=HAv2)](https://travis-ci.org/okwolf/hyperapp-fx)
[![codecov](https://codecov.io/gh/okwolf/hyperapp-fx/branch/HAv2/graph/badge.svg)](https://codecov.io/gh/okwolf/hyperapp-fx/branch/HAv2)
[![npm](https://img.shields.io/npm/v/hyperapp-fx/next.svg)](https://www.npmjs.com/package/hyperapp-fx/v/next)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

A handy set of effects for use with [Hyperapp](https://github.com/jorgebucaran/hyperapp).

## Getting Started

Here's a taste of how to use a common effect for making HTTP requests. The app displays inspiring quotes about design, fetching a new quote each time the user clicks on the current one. Go ahead and [try it online here](https://codepen.io/okwolf/pen/vPbMaa?editors=0010).

```js
import { h, app } from "hyperapp"
import { Http } from "hyperapp-fx"

const GetQuote = () => [
  "...",
  Http({
    url:
      "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1",
    action: (_, [{ content }]) => content
  })
]

app({
  init: "Click here for quotes",
  view: quote => <h1 onclick={GetQuote}>{quote}</h1>,
  container: document.body
})
```

More [examples](https://codepen.io/collection/ArmxQj) are available to show other in action.

## Installation

<pre>
npm i <a href=https://www.npmjs.com/package/hyperapp-fx/v/next>hyperapp-fx@next</a>
</pre>

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org), use as you would anything else.

```js
import { Http } from "hyperapp-fx"
```

If you don't want to set up a build environment, you can download Hyperapp FX from a CDN like [unpkg.com](https://unpkg.com/hyperapp-fx@next) and it will be globally available through the <samp>window.hyperappFx</samp> object. We support all ES5-compliant browsers, including Internet Explorer 10 and above.

```html
<script src="https://unpkg.com/hyperapp-fx@next"></script>
```

## [API documentation](api.md)

## License

Hyperapp FX is MIT licensed. See [LICENSE](LICENSE.md).
