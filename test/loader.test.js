import fs from 'fs';
import path from 'path';
import util from 'util';
import loader from '../src/loader';
import compiler from './compiler.js';
import {getOutput} from './get-output';

const readFile = util.promisify(fs.readFile);

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
            /export\s+default\s+function\s*\(/,
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

describe('dependencies parse', function() {
    test('should add dependencies', async function(done) {
        const fixturePath = path.resolve('test/fixtures/with-dependencies.xml');
        const source = await readFile(fixturePath, 'utf8');
        const context = {
            query: '',
            resourcePath: fixturePath,
            async() {
                return function(err) {
                    if (err) {
                        return done(err);
                    }

                    expect(context.addDependency).toHaveBeenCalledTimes(4);
                    expect(context.addDependency).toHaveBeenCalledWith(
                        expect.stringMatching('nested-dependency.xml')
                    );
                    expect(context.addDependency).toHaveBeenCalledWith(
                        expect.stringMatching('styles.css')
                    );
                    expect(context.addDependency).toHaveBeenCalledWith(
                        expect.stringMatching('include.xml')
                    );
                    expect(context.addDependency).toHaveBeenCalledWith(
                        expect.stringMatching('script.js')
                    );

                    done();
                }
            },
            addDependency: jest.fn()
        };

        loader.call(context, source);
    });
});
