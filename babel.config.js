const nodeVersion = require('./package.json').engines.node;

module.exports = function(api) {
    api.cache(true);

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        node: nodeVersion.replace(/>=\s+/, '')
                    }
                }
            ]
        ]
    };
};
