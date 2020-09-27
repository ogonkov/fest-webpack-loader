[![npm package][npm-image]][npm-url] 
[![Coverage Status][coverage-image]][coverage-url] 
[![node][node]][node-url] 
[![Build Status][build-image]][build-url] 
[![Dependencies Status][david-image]][david-url]

# Fest templates loader for Webpack

This Webpack loader compiles [Fest](https://github.com/mailru/fest) templates.

Loader is trying to build dependencies tree by walking through
`<fest:include/>`, `<fest:insert/>` and `<fest:script/>` tags of template.

When loader emits warning, that means that XML parser failed to parse a file
and get dependencies from it. You probably would like to fix file syntax, to
have complete experience with webpack rebuild on change.

> :exclamation: Using builtin beautifier could break ES syntax in scripts, that is inlined
> via `<fest:script/>`. Consider switching off `beautify` option.

## Install
```bash
npm install --save-dev fest-webpack-loader
```

## Usage
All referenced templates compiles to ES modules.

```js
import template from './template.xml';
```

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.xml$/,
        use: [
          {
            loader: 'fest-webpack-loader'
          }
        ]
      }
    ]
  }
}
```

## Options

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`beautify`**|`{Boolean}`|`false`|Beautify compiled template. Built-in `fest` beautifier breaks ES syntax.|
|**`trackDependencies`**|`{Boolean}`|`true` for development mode otherwise `false`|Enable template dependencies tracking|
|**`module`**|`{String}`|`es`|Compiled template module type. `es` or `cjs`.|

[npm-image]:https://img.shields.io/npm/v/fest-webpack-loader.svg
[npm-url]:http://npmjs.org/package/fest-webpack-loader
[coverage-image]:https://coveralls.io/repos/github/ogonkov/fest-webpack-loader/badge.svg?branch=master
[coverage-url]:https://coveralls.io/github/ogonkov/fest-webpack-loader?branch=master
[node]: https://img.shields.io/node/v/fest-webpack-loader.svg
[node-url]: https://nodejs.org
[build-image]:https://github.com/ogonkov/fest-webpack-loader/workflows/Tests/badge.svg?branch=master
[build-url]:https://github.com/ogonkov/fest-webpack-loader/actions?query=branch%3Amaster+workflow%3ATests
[david-image]:https://david-dm.org/ogonkov/fest-webpack-loader/status.svg
[david-url]:https://david-dm.org/ogonkov/fest-webpack-loader
