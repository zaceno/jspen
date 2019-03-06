import { Effect } from './util'
const PREFIX = 'jspen_'
const LIST = 'jspenlist'

export const Save = Effect((props, dispatch) => {
    const list = JSON.parse(localStorage.getItem(LIST) || '{}')
    list[props.name] = true
    localStorage.setItem(LIST, JSON.stringify(list))
    localStorage.setItem(PREFIX + props.name, props.code)
    props.onsaved && dispatch(props.onsaved)
})

export const Load = Effect((props, dispatch) => {
    const code = localStorage.getItem(PREFIX + props.name) || ''
    dispatch(props.onload, code)
})

export const List = Effect((props, dispatch) => {
    const list = JSON.parse(localStorage.getItem(LIST) || '{}')
    const list2 = Object.keys(list)
    list2.sort()
    dispatch(props.onupdate, list2)
})
