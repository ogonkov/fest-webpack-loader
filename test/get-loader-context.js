export function getLoaderContext(resourcePath, options = {}) {
    const callback = jest.fn().mockName('loaderContext.callback');
    const context = {
        resourcePath,
        async: jest.fn().mockReturnValue(callback),
        addDependency: jest.fn().mockName('loaderContext.addDependency'),
        emitWarning: jest.fn().mockName('loaderContext.emitWarning'),
        getOptions: jest.fn().mockName('loaderContext.getOptions').mockReturnValue(options)
    };
    const result = new Promise(function(resolve, reject) {
        callback.mockImplementation(function(error, result) {
            if (error) {
                return reject(error);
            }

            resolve(result);
        });
    });

    return {
        context,
        result
    };
}
