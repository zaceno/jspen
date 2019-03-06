import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import { EDITOR_OPTIONS } from './const'
import { Effect } from './util'
export const Init = Effect((props, dispatch) => {
    setTimeout(() => {
        const containerElem = document.getElementById(props.container)
        const instance = CodeMirror(containerElem, EDITOR_OPTIONS)
        containerElem.querySelector('.CodeMirror').style.height = 'auto'
        dispatch(props.onstart, instance)
    }, 0)
})

export const Set = Effect(props =>
    setTimeout(_ => {
        props.instance.silentChange = true
        props.instance.setValue(props.code)
    }, 0)
)

export const Save = Effect((props, dispatch) => {
    CodeMirror.commands.save = _ => {
        dispatch(props.onsave, props.instance.getValue())
    }
    return _ => (CodeMirror.commands.save = () => {})
})

export const Change = Effect((props, dispatch) => {
    const handler = () => {
        const sc = props.instance.silentChange
        props.instance.silentChange = false
        if (sc) return
        setTimeout(() => dispatch(props.onchange, props.instance.getValue()), 0)
    }
    props.instance.on('changes', handler)
    return () => props.instance.off('changes', handler)
})
