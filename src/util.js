export const Effect = fn => props => [fn, props]

export const Action = f => (...args) => {
    const ret = f(...args)
    if (Array.isArray(ret)) return ret.filter(x => !!x)
    return ret
}
