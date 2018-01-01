import compiler from './compiler.js';

let stats, output;

beforeEach(async () => {
    stats = await compiler('example.xml');
    output = stats.toJson().modules[0].source;
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
