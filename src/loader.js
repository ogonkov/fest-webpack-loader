import {getOptions} from 'loader-utils';
import validateOptions from 'schema-utils';
import fest from 'fest';

import {getDependencies} from './get-dependencies';

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

function compile(source, {
    beautify = true,
    module = 'es',
    resourcePath
} = {}) {
    return function(resolve, reject) {
        try {
            const compiled = fest.compile({
                path: resourcePath,
                contents: source
            }, {
                beautify: beautify
            });

            resolve(getModuleWrapper(compiled, module));
        } catch(ex) {
            reject(ex);
        }
    };
}

export default function festLoader(source) {
    const callback = this.async();

    let options;
    try {
        options = getOptions(this);
        validateOptions(schema, options || {}, {
            name: 'Fest Loader',
            baseDataPath: 'options'
        });
    } catch (e) {
        callback(e);

        return;
    }

    // Tracking dependencies is optional feature, that could fail
    getDependencies(this.resourcePath, source).catch(() => []).then((deps) => {
        deps.forEach((dep) => this.addDependency(dep));
    }).then(() => (
        new Promise(compile(source, {
            ...options,
            resourcePath: this.resourcePath
        }))
    )).then(function(compiled) {
        callback(null, compiled);
    }).catch(function(exception) {
        callback(exception, '');
    });
}
