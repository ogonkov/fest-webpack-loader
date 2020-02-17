[![npm package][npm-image]][npm-url] 
[![Coverage Status][coverage-image]][coverage-url] 
[![node][node]][node-url] 
[![Build Status][travis-image]][travis-url] 
[![Dependencies Status][david-image]][david-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

# Fest templates loader for Webpack

This Webpack loader compiles [Fest](https://github.com/mailru/fest) templates.

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
|**`beautify`**|`{Boolean}`|`true`|Beautify compiled template|
|**`module`**|`{String}`|`es`|Compiled template module type. `es` or `cjs`.|

[npm-image]:https://img.shields.io/npm/v/fest-webpack-loader.svg
[npm-url]:http://npmjs.org/package/fest-webpack-loader
[coverage-image]:https://coveralls.io/repos/github/ogonkov/fest-webpack-loader/badge.svg?branch=master
[coverage-url]:https://coveralls.io/github/ogonkov/fest-webpack-loader?branch=master
[node]: https://img.shields.io/node/v/fest-webpack-loader.svg
[node-url]: https://nodejs.org
[travis-image]:https://travis-ci.org/ogonkov/fest-webpack-loader.svg?branch=master
[travis-url]:https://travis-ci.org/ogonkov/fest-webpack-loader
[david-image]:https://david-dm.org/ogonkov/fest-webpack-loader/status.svg
[david-url]:https://david-dm.org/ogonkov/fest-webpack-loader
[greenkeeper-image]:https://badges.greenkeeper.io/ogonkov/fest-webpack-loader.svg
[greenkeeper-url]:https://greenkeeper.io/
