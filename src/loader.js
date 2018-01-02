import {getOptions} from 'loader-utils';
import validateOptions from 'schema-utils';

import fest from 'fest';

const schema = {
    type: 'object',
    properties: {
        beautify: {
            type: 'boolean'
        },
        module: {
            enum: ['es', 'cjs']
        }
    },
    additionalProperties: false
};

function getModuleWrapper(compiled, moduleType) {
    switch (moduleType) {
        case 'cjs':
            return `module.exports = ${compiled}`;
        case 'es':
        default:
            return `export default ${compiled}`;
    }
}

const defaults = {
    beautify: true
};

function compile(source, options = defaults) {
    return function(resolve, reject) {
        try {
            const compiled = fest.compile({
                path: options.resourcePath,
                contents: source
            }, {
                beautify: options.beautify
            });

            resolve(getModuleWrapper(compiled, options.module));
        } catch(ex) {
            reject(ex);
        }
    };
}

export default function festLoader(source) {
    const options = getOptions(this);

    validateOptions(schema, options || {}, 'Fest Loader');

    const promise = new Promise(compile(source, Object.assign({}, options, {
        resourcePath: this.resourcePath
    })));

    const callback = this.async();
    promise.then(function(compiled) {
        callback(null, compiled);
    }, function(exception) {
        callback(exception, '');
    });
}
