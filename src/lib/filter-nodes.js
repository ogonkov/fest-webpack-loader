import {NODE_ATTRIBUTES, NODE_TEXT} from './nodes';

/**
 * @param {Object}   object
 * @param {string[]} nodeNames
 * @param {string[]} ignoreNodes
 * @returns {{name: string, item: {}[]}[]}
 */
export function filterNodes(
    object,
    nodeNames,
    ignoreNodes = [NODE_ATTRIBUTES, NODE_TEXT]
) {
    const stack = [object];
    const found = [];

    function isNotIgnored(key) {
        return ignoreNodes.includes(key) === false;
    }

    while (stack.length) {
        const item = stack.shift();

        const keys = Object.keys(item).filter(isNotIgnored);

        if (!keys.length) {
            continue;
        }

        for (let i = 0; i < keys.length; i++) {
            const nodeName = keys[i];
            const {[nodeName]: nextItem} = item;

            if (nodeNames.includes(nodeName)) {
                found.push(...nextItem.map((item) => ({
                    name: nodeName,
                    item: [item]
                })));

                continue;
            }

            if (Array.isArray(nextItem)) {
                stack.push(...nextItem);

                continue;
            }

            if (typeof nextItem !== 'object') {
                continue;
            }

            stack.push(nextItem);
        }
    }

    return found;
}
