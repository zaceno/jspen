import { Effect } from './util'
import * as db from './db'

let codes = { '': '' }
let docs = {}

let synced = db.all().then(modules => {
    return modules.map(([id, { name, code }]) => {
        codes[name] = code
        docs[name] = id
    })
})

export const getCode = name => codes[name] || ''

export const Rename = Effect((props, dispatch) => {
    synced
        .then(_ => {
            //do the local updates immediately.
            //db updates afterward.

            const exists = !!codes[props.newName]
            if (exists && props.newName !== '') return false

            let code = codes[props.oldName]
            let promises = []
            if (props.oldName !== '') {
                let id = docs[props.oldName]
                delete codes[props.oldName]
                delete docs[props.oldName]
                promises.push(db.remove(id))
            }
            codes[props.newName] = code
            if (exists) {
                promises.push(
                    db.update(docs[props.newName], {
                        name: props.newName,
                        code,
                    })
                )
            } else {
                promises.push(
                    db.create({ name: props.newName, code }).then(id => {
                        docs[props.newName] = id
                    })
                )
            }
            return Promise.all(promises)
        })
        .then(ok => {
            dispatch(props.action, {
                name: ok ? props.newName : props.oldName,
                code: codes[props.newName],
                list: Object.keys(codes).sort(),
            })
        })
})

export const Load = Effect((props, dispatch) => {
    synced.then(_ =>
        dispatch(props.action, {
            code: codes[props.name] || '',
            list: Object.keys(codes).sort(),
            name: props.name,
        })
    )
})

export const Save = Effect((props, dispatch) => {
    synced.then(_ => {
        codes[props.name] = props.code
        return db
            .update(docs[props.name], {
                name: props.name,
                code: props.code,
            })
            .then(_ => dispatch(props.action))
    })
})
