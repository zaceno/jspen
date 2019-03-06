import { Effect } from './util'
import { app } from 'hyperapp'
import html from './html'
import { style, reset as resetStyles } from './styling'

export const Init = Effect((props, dispatch) => {
    setTimeout(() => {
        const element = document.getElementById(props.container)
        dispatch(props.onstart, element)
    }, 0)
})

export const Run = Effect(props => {
    props.instance.innerHTML = ''
    resetStyles()
    const fn = new Function(props.code)
    const ctx = {
        output: props.instance,
        hyperapp: { app, html },
        style: style(props.instance.id),
    }
    try {
        fn.call(ctx)
    } catch (e) {
        console.error(e)
    }
})
