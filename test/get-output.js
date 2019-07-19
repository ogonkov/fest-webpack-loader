export function getOutput(stats) {
    return stats.toJson().modules[0].source;
}
