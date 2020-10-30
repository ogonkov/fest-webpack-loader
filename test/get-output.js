export function getOutput(stats) {
    return stats.toJson({
        source: true
    }).modules[0].source;
}
