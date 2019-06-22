# Watch Size [<img src="https://jonathantneal.github.io/dom-logo.svg" alt="PostCSS" width="90" height="90" align="right">][Watch Size]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[Watch Size] lets you watch the size changes of a DOM element using the
`watchSize` function.

## Usage

Add [Watch Size] to your project:

```bash
npm install watch-size
```

Use `watchSize()` to rewrite your queries:

```js
import watchSize from 'watch-size';

const stop = watchSize(
  document.querySelector('.box:nth-child(2)')
  ({ width, height }) => { /* callback */ }
);

/* use stop() to end listening */
```

## How does it work?

The `watchSize` function attaches hidden, over-sized DOM elements to your
target with `scroll` listeners that are triggered whenever the element resizes.
This allows the listener to avoid polling, and to truly respond to size changes.
This technique can be used in all browsers going back to Internet Explorer 9.

The entire script is about 400 bytes when minified and gzipped.

[cli-img]: https://img.shields.io/travis/jonathantneal/watch-size.svg
[cli-url]: https://travis-ci.org/jonathantneal/watch-size
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/watch-size.svg
[npm-url]: https://www.npmjs.com/package/watch-size

[Watch Size]: https://github.com/jonathantneal/watch-size
