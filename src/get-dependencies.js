import path from 'path';
import fs from 'fs';
import util from 'util';
import {getParser} from './get-parser';
import {NODE_ATTRIBUTES} from './nodes';
import {filterNodes} from './filter-nodes';

const readFile = util.promisify(fs.readFile);

/**
 * @param {{attribute: {}[]}} node
 * @return {boolean}
 */
function hasAttributes({item: [attributes]}) {
    return Boolean(attributes?.[NODE_ATTRIBUTES]);
}

function getSrcAttribute({item: [attributes]}) {
    return attributes[NODE_ATTRIBUTES].src;
}

/**
 * @param {string} source
 * @return {Promise<Set<string>>}
 */
async function getFileImports(source) {
    const root = await getParser().then((parseString) => parseString(source));
    const nodes = filterNodes(root, [
        'fest:include',
        'fest:insert',
        'fest:script'
    ]);

    return new Set(
        nodes.filter(hasAttributes).map(getSrcAttribute)
    );
}

/**
 * @param {string} parentFile
 * @param {string} importedPath
 * @return {string}
 */
function getAbsolutePath(parentFile, importedPath) {
    return path.resolve(path.dirname(parentFile), importedPath);
}

async function getAbsoluteFileImports(resourcePath, source) {
    const toAbsolutePath = getAbsolutePath.bind(null, resourcePath);
    const fileImports = await getFileImports(source);

    return [...fileImports].map(toAbsolutePath);
}

export async function getDependencies(loaderContext, source) {
    const {resourcePath} = loaderContext;
    const dependencies = new Set();
    let stack = [
        [resourcePath, source]
    ];

    do {
        const [resourcePath, source] = stack.shift();

        let absoluteFileImports;
        try {
            absoluteFileImports = await getAbsoluteFileImports(
                resourcePath,
                source
            );
        } catch (e) {
            loaderContext.emitWarning(e);

            continue;
        }
        absoluteFileImports = absoluteFileImports.filter((fileImport) => (
            !dependencies.has(fileImport)
        ));

        for (const fileImport of absoluteFileImports) {
            dependencies.add(fileImport);

            if (!fileImport.endsWith('.xml')) {
                continue;
            }

            let source;
            try {
                source = await readFile(fileImport, 'utf8');
            } catch (e) {
                loaderContext.emitWarning(e);

                continue;
            }

            stack.push([fileImport, source]);
        }
    } while (stack.length);

    return dependencies;
}
