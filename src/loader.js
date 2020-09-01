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

/**
 * @param {string} source
 * @param {Object} options
 * @param {boolean} [options.beautify=true]
 * @param {string} [options.module=es]
 * @param {string} options.resourcePath
 * @returns {Promise<string, Error>}
 */
function compile(source, {
    beautify = true,
    module = 'es',
    resourcePath
} = {}) {
    return new Promise(function(resolve, reject) {
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
    });
}

export default function festLoader(source) {
    const callback = this.async();

    let options;
    try {
        options = getOptions(this);
        validateOptions(schema, options, {
            name: 'Fest Loader',
            baseDataPath: 'options'
        });
    } catch (e) {
        callback(e);

        return;
    }

    Promise.all([
        // Tracking dependencies is optional feature, that could fail
        getDependencies(this, source).catch(() => []),
        compile(source, {
            ...options,
            resourcePath: this.resourcePath
        })
    ]).then(([deps, compiled]) => {
        deps.forEach((dep) => this.addDependency(dep));
        callback(null, compiled);
    }).catch(function(exception) {
        callback(exception, '');
    });
}
