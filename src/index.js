import css from './index.css'
import { app } from 'hyperapp'
import { batchFx } from './util'
import * as output from './output'
import * as editor from './editor'
import * as store from './store'
import html from './html.js'
const { div, select, option, input, span } = html

const onInit = action => (state, data) => {
    const news = action(state, data)
    return [
        news,
        !state.code &&
            news.editor &&
            news.code &&
            editor.Load({ instance: news.editor, code: news.code }),
        !state.editor &&
            news.editor &&
            news.code &&
            editor.Load({ instance: news.editor, code: news.code }),
        !state.output &&
            news.output &&
            news.code &&
            output.Run({ instance: news.output, code: news.code }),
        !state.code &&
            news.output &&
            news.code &&
            output.Run({ instance: news.output, code: news.code }),
        !state.list.length &&
            news.list.length &&
            store.Load({ name: '', action: onInitCode }),
    ].filter(x => x)
}
const onInitOutput = onInit((state, output) => ({ ...state, output }))
const onInitEditor = onInit((state, editor) => ({ ...state, editor }))
const onInitStore = onInit((state, list) => ({ ...state, list }))
const onInitCode = onInit((state, code) => ({ ...state, code }))

const onCodeChanged = (state, code) => ({ ...state, code, dirty: true })
const save = (state, code) => [
    { ...state, code },
    store.Save({ name: state.name, code, action: onSave }),
]
const onSave = state => ({ ...state, dirty: false })

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

        store.Init({
            action: onInitStore,
        }),
    ],
    subscriptions: state => [
        state.editor && [
            editor.Change({
                instance: state.editor,
                action: onCodeChanged,
            }),
            editor.Save({
                instance: state.editor,
                action: save,
            }),
        ],
    ],
    view: state =>
        div({ id: css.container }, [
            div({ id: css.toolbar }, [
                select(
                    {
                        //                      onchange: listSelectionChanged,
                    },
                    state.list.map(name =>
                        option({ selected: state.name === name }, name)
                    )
                ),
                input({
                    //                    onchange: changeName,
                    value: state.name,
                }),
                span(state.dirty ? '\u270D' : '\u2713'),
            ]),
            div({ id: css.editor }),
            div({ id: css.output }),
        ]),
    container: document.body,
})
