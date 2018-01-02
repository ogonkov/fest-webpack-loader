import {getOptions} from 'loader-utils';
import validateOptions from 'schema-utils';

import fest from 'fest';

const schema = {
    type: 'object',
    properties: {
        beautify: {
            type: 'boolean'
        }
    },
    additionalProperties: false
};

export default function festLoader(source) {
    const options = getOptions(this);

    validateOptions(schema, options || {}, 'Fest Loader');

    const callback = this.async();

    const promise = new Promise((resolve, reject) => {
        try {
            const compiled = fest.compile({
                path: this.resourcePath,
                contents: source
            }, options);

            resolve(`export default ${compiled}`);
        } catch(ex) {
            reject(ex);
        }
    });

    promise.then(function(compiled) {
        callback(null, compiled);
    }, function(exception) {
        callback(exception, '');
    });
}
