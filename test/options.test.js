import compiler from './compiler';

describe('options', function() {
    test('should pass with valid options', async function() {
        await expect(compiler('example.xml', {
            beautify: false,
            module: 'es'
        })).resolves.toEqual(expect.any(Object));
    });

    test('should fail with wrong options', async function() {
        const stats = await compiler('example.xml', {
            beautify: 'a lot',
            module: 'umd'
        });

        const {message: errorMessage} = stats.compilation.errors[0];

        expect(errorMessage).toMatch('Fest Loader');
        expect(errorMessage).toMatch('options.beautify should be a boolean');
        expect(errorMessage).toMatch('options.module should be one of these');
    });
});
