import css from './index.css'
import { app } from 'hyperapp'
import { batchFx } from './util'
import * as output from './output'
import * as editor from './editor'
import * as store from './store'
import html from './html.js'
const { div, select, option, input, span } = html

const changeName = (state, event) => [
    { ...state, current: event.target.value },
    store.Save({ code: state.code, name: event.target.value }),
]

const editorStarted = (state, instance) =>
    [
        { ...state, editor: instance },
        state.code && editor.Set({ code: state.code, instance }),
    ].filter(x => x)

const outputStarted = (state, instance) =>
    [
        { ...state, output: instance },
        state.code && output.Run({ code: state.code, instance }),
    ].filter(x => x)

const codeChanged = (state, code) => ({ ...state, code, dirty: true })

const saveCode = (state, code) => [
    state,
    store.Save({
        code,
        onsaved: codeSaved,
        name: state.current,
    }),
]

const codeSaved = state =>
    [
        { ...state, dirty: false },
        state.output &&
            output.Run({ instance: state.output, code: state.code }),
    ].filter(x => x)

const codeLoaded = (state, code) =>
    [
        { ...state, code, dirty: false },
        state.editor && editor.Set({ code, instance: state.editor }),
    ].filter(x => x)

const listLoaded = (state, list) => ({ ...state, list })
const listSelectionChanged = (state, event) => [
    { ...state, current: event.target.value },
    store.Load({
        name: event.target.value,
        onload: codeLoaded,
    }),
]

document.body.innerHTML = ''
app({
    init: [
        {
            editor: null,
            output: null,
            code: null,
            modules: [],
            current: '',
            list: [''],
        },

        editor.Init({
            container: css.editor,
            onstart: editorStarted,
        }),

        output.Init({
            container: css.output,
            onstart: outputStarted,
        }),

        store.Load({
            name: '',
            onload: codeLoaded,
        }),

        store.List({
            onupdate: listLoaded,
        }),
    ],
    subscriptions: state => [
        state.editor && [
            editor.Change({
                instance: state.editor,
                onchange: codeChanged,
            }),
            editor.Save({
                instance: state.editor,
                onsave: saveCode,
            }),
        ],
    ],
    view: state =>
        div({ id: css.container }, [
            div({ id: css.toolbar }, [
                select(
                    {
                        onchange: listSelectionChanged,
                    },
                    state.list.map(name =>
                        option({ selected: state.current === name }, name)
                    )
                ),
                input({
                    onchange: changeName,
                    value: state.current,
                }),
                span(state.dirty ? '\u270D' : '\u2713'),
            ]),
            div({ id: css.editor }),
            div({ id: css.output }),
        ]),
    container: document.body,
})
