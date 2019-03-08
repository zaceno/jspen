import { Effect } from './util'
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

const onQuit = {
    listeners: [],
    on(f) {
        onQuit.listeners.push(f)
    },
    emit() {
        onQuit.listeners.forEach(f => f())
        onQuit.listeners = []
    },
}

window.addEventListener('unload', _ => onQuit.emit())

export const Run = Effect(props => {
    props.instance.innerHTML = ''
    onQuit.emit()
    run(props.name, {
        output: props.instance,
        onquit: f => onQuit.on(f),
    })
})

export const Init = Effect((props, dispatch) => {
    setTimeout(() => {
        const element = document.getElementById(props.container)
        dispatch(props.action, element)
    }, 0)
})
