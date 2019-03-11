import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/jump-to-line'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/javascript-lint'
import { JSHINT } from 'jshint'
window.JSHINT = JSHINT

const EDITOR_OPTIONS = {
    mode: 'javascript',
    theme: 'base16-light',
    indentUnit: 4,
    lineNumbers: true,
    keyMap: 'sublime',
    autoCloseBrackets: true,
    gutters: ['CodeMirror-lint-markers'],
    lint: {
        esversion: 9,
        asi: true,
    },
}
import { Effect } from './util'

export const Init = Effect((props, dispatch) => {
    setTimeout(() => {
        const containerElem = document.getElementById(props.container)
        const instance = CodeMirror(containerElem, EDITOR_OPTIONS)
        containerElem.querySelector('.CodeMirror').style.height = 'auto'
        dispatch(props.action, instance)
    }, 0)
})

export const Load = Effect(props =>
    setTimeout(_ => {
        props.instance.silentChange = true
        props.instance.setValue(props.code)
    }, 0)
)

export const onSave = Effect((props, dispatch) => {
    CodeMirror.commands.save = _ =>
        dispatch(props.action, props.instance.getValue())
    return _ => (CodeMirror.commands.save = () => {})
})

export const onChange = Effect((props, dispatch) => {
    const handler = () => {
        const sc = props.instance.silentChange
        props.instance.silentChange = false
        if (sc) return
        setTimeout(() => dispatch(props.action, props.instance.getValue()), 0)
    }
    props.instance.on('changes', handler)
    return () => props.instance.off('changes', handler)
})

export const SetTheme = Effect(props => {
    props.instance.setOption('theme', 'base16-' + props.theme)
})
