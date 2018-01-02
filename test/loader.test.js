import compiler from './compiler.js';

function getOutput(stats) {
    return stats.toJson().modules[0].source;
}

describe('Default usage', function() {
    let stats, output;

    beforeEach(async () => {
        stats = await compiler('example.xml');
        output = getOutput(stats);
    });

    test('Converts xml to JS', () => {
        expect(output).toMatch('export default function');
    });

    test('Evals output to template', () => {
        var compiled = new Function(output.replace(
            /export\s+default\s+function\s+\(/,
            'return function('
        ))();

        expect(compiled({name: 'world'})).toBe('Hello, world!');
    });
});

describe("'module' option", function() {
    test('Exports CJS', async function() {
        const output = getOutput(await compiler('example.xml', {
            module: 'cjs'
        }));

        expect(output).toMatch('module.exports = function');
    });
});
