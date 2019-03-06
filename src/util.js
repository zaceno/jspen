export const batchFx = (...fx) => [(_, d) => fx.forEach(e => d(x => [x, e])), 0]
export const Effect = fn => props => [fn, props]
