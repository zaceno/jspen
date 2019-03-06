import { Effect } from './util'
const PREFIX = 'jspen_'
const LIST = 'jspenlist'

export const Save = Effect((props, dispatch) => {
    const list = JSON.parse(localStorage.getItem(LIST) || '{"": true}')
    list[props.name] = true
    localStorage.setItem(LIST, JSON.stringify(list))
    localStorage.setItem(PREFIX + props.name, props.code)
    props.action && dispatch(props.action)
})

export const Load = Effect((props, dispatch) => {
    const code = localStorage.getItem(PREFIX + props.name) || ''
    props.action && dispatch(props.action, code)
})

export const Init = Effect((props, dispatch) => {
    const list = JSON.parse(localStorage.getItem(LIST) || '{"": true}')
    const list2 = Object.keys(list)
    list2.sort()
    props.action && dispatch(props.action, list2)
})
