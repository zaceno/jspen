import css from './index.css'
import { app } from 'hyperapp'
import { batchFx } from './util'
import * as output from './output'
import * as editor from './editor'
import * as store from './store'
import html from './html.js'
const { div, select, option, input, span } = html

const onInitOutput = (state, instance) =>
    [
        { ...state, output: instance },
        state.code && output.Run({ instance, code: state.code }),
    ].filter(x => x)

const onInitEditor = (state, instance) =>
    [
        { ...state, editor: instance },
        state.code && editor.Load({ instance, code: state.code }),
    ].filter(x => x)

const onInitStore = (state, props) =>
    [
        {
            ...state,
            list: props.list,
            code: props.code,
            name: props.name,
        },
        state.editor &&
            editor.Load({ instance: state.editor, code: props.code }),
        state.output &&
            output.Run({ instance: state.output, code: props.code }),
    ].filter(x => x)

const onCodeChanged = (state, code) => ({ ...state, code, dirty: true })

const onSave = state => [
    { ...state, dirty: false },
    output.Run({ instance: state.output, code: state.code }),
]

const save = (state, code) => [
    { ...state, code },
    store.Save({ name: state.name, code, action: onSave }),
]

const onRename = (state, props) => {
    return {
        ...state,
        list: props.list,
        name: props.name,
    }
}
const rename = (state, event) => [
    state,
    store.Rename({
        oldName: state.name,
        newName: event.target.value,
        action: onRename,
    }),
]

const load = (state, event) => [
    { ...state, dirty: false },
    store.Save({ name: state.name, code: state.code }),
    store.Load({ name: event.target.value, action: onLoad }),
]

const onLoad = (state, props) => [
    {
        ...state,
        code: props.code,
        name: props.name,
        list: props.list,
    },
    editor.Load({ instance: state.editor, code: props.code }),
    output.Run({ instance: state.output, code: props.code }),
]

document.body.innerHTML = ''
app({
    init: [
        {
            editor: null,
            output: null,
            code: null,
            name: '',
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

        store.Load({
            name: '',
            action: onInitStore,
        }),
    ],
    subscriptions: state => [
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
