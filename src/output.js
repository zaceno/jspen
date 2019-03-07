import { Effect } from './util'
import { app } from 'hyperapp'
import html from './html'
import { style, reset as resetStyles } from './styling'
import { getCode } from './store'

const run = (name, context, cache, chain) => {
    chain = { ...(chain || {}) }
    cache = cache || {}
    if (chain[name]) throw new Error('Cyclical dependency on' + name)
    chain[name] = true
    if (!cache[name]) {
        cache[name] = {}
        try {
            const fn = new Function(getCode(name))
            const context2 = {
                ...context,
                load: name => run(name, context, cache, chain),
            }
            if (!context.main) {
                context2.main = context2
                context.main = context2
            }
            cache[name].value = fn.call(context2)
        } catch (e) {
            console.error(e)
        }
    }
    return cache[name].value
}

export const Run = Effect(props => {
    props.instance.innerHTML = ''
    resetStyles()
    run(props.name, {
        hyperapp: { app, html },
        style: style(props.instance.id),
        output: props.instance,
    })
})

export const Init = Effect((props, dispatch) => {
    setTimeout(() => {
        const element = document.getElementById(props.container)
        dispatch(props.action, element)
    }, 0)
})
