import css from './index.css'
import { app } from 'hyperapp'
import { Action } from './util'
import html from './html.js'
const { div, select, option, input, span } = html

import * as output from './output'
import * as editor from './editor'
import * as store from './store'

const onInitOutput = Action((state, instance) => [
    { ...state, output: instance },
    state.code !== null &&
        output.Run({ instance, name: state.name, code: state.code }),
])

const onInitEditor = Action((state, instance) => [
    { ...state, editor: instance },
    state.code !== null && editor.Load({ instance, code: state.code }),
])

const onCodeChanged = Action((state, code) => ({ ...state, code, dirty: true }))

const save = Action((state, code) => [
    { ...state, code, dirty: false },
    store.Save({ name: state.name, code }),
    output.Run({ instance: state.output, name: state.name, code }),
])

const load = Action((state, event) => [
    state,
    store.Save({ name: state.name, code: state.code }),
    store.Load({ name: event.target.value, action: onLoadCode }),
])

const onUpdateList = Action((state, list) => [
    { ...state, list },
    state.name === null && store.Load({ name: '', action: onLoadCode }),
])

const onLoadCode = Action((state, { code, name }) => {
    return [
        { ...state, code, name, dirty: false },
        state.editor && editor.Load({ instance: state.editor, code }),
        state.output && output.Run({ code, name, instance: state.output }),
    ]
})

const rename = Action((state, event) => [
    { ...state, name: event.target.value },
    store.Rename({
        oldName: state.name,
        newName: event.target.value,
        action: onRename,
    }),
])
const onRename = Action((state, name) => ({ ...state, name }))

document.body.innerHTML = ''
app({
    init: [
        {
            editor: null,
            output: null,
            code: null,
            name: null,
            list: [],
            dirty: false,
        },

        editor.Init({
            container: css.editor,
            action: onInitEditor,
        }),

        output.Init({
            container: css.output,
            action: onInitOutput,
        }),
    ],
    subscriptions: state => [
        store.List(onUpdateList),
        state.editor && [
            editor.onChange({
                instance: state.editor,
                action: onCodeChanged,
            }),
            editor.onSave({
                instance: state.editor,
                action: save,
            }),
        ],
    ],
    view: state =>
        div({ id: css.container }, [
            div({ id: css.toolbar }, [
                select(
                    { onchange: load },
                    state.list.map(name =>
                        option({ selected: state.name === name }, name)
                    )
                ),
                input({
                    onchange: rename,
                    value: state.name,
                }),
                span(state.dirty ? '\u270D' : '\u2713'),
            ]),
            div({ id: css.editor }),
            div({ id: css.output }),
        ]),
    container: document.body,
})
