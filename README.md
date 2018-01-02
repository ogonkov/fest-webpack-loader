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
