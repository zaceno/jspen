import { Effect } from './util'
const PREFIX = 'jspen_'
const LIST = 'jspenlist'
const list = JSON.parse(localStorage.getItem(LIST) || '{"": true}')
const saveList = _ => localStorage.setItem(LIST, JSON.stringify(list))
const listArr = _ => Object.keys(list).sort()
const listHas = name => !!list[name]
export const getCode = name => localStorage.getItem(PREFIX + name) || ''
const saveCode = (name, code) => {
    localStorage.setItem(PREFIX + name, code)
    list[name] = true
    saveList()
}
const remove = name => {
    localStorage.removeItem(PREFIX + name)
    delete list[name]
    saveList()
}

export const Save = Effect((props, dispatch) => {
    saveCode(props.name, props.code)
    props.action && dispatch(props.action)
})

export const Rename = Effect((props, dispatch) => {
    const code = getCode(props.oldName)
    if (listHas(props.newName) && props.newName !== '') {
        props.action &&
            dispatch(props.action, {
                name: props.oldName,
                list: listArr(),
                code,
            })
        return
    }
    if (props.oldName !== '') remove(props.oldName)
    saveCode(props.newName, code)
    props.action &&
        dispatch(props.action, {
            name: props.newName,
            list: listArr(),
            code,
        })
})

export const Load = Effect(
    (props, dispatch) =>
        props.action &&
        dispatch(props.action, {
            code: getCode(props.name),
            name: props.name,
            list: listArr(),
        })
)
