import { Effect } from './util'
import firebase from 'firebase/app'
import 'firebase/firestore'

const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyDu6WmqKggBQwMW1-aiZAw6x3e_hvmYJJU',
    authDomain: 'jspen-19e27.firebaseapp.com',
    projectId: 'jspen-19e27',
}
const FIREBASE_COLLECTION = 'modules'

firebase.initializeApp(FIREBASE_CONFIG)
const db = firebase.firestore()

try {
    db.enablePersistence()
} catch (err) {
    if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)
    }
}

let ids = {}
let codes = {}
export const List = Effect((action, dispatch) => {
    db.collection(FIREBASE_COLLECTION).onSnapshot(snapshot => {
        ids = {}
        snapshot.forEach(doc => {
            let { code, name } = doc.data()
            ids[name] = doc.id
            codes[name] = code
        })
        dispatch(action, Object.keys(ids).sort())
    })
    return db.collection(FIREBASE_COLLECTION).onSnapshot(() => {})
})

export const Load = Effect(({ name, action }, dispatch) => {
    if (!codes[name]) return
    dispatch(action, { name, code: codes[name] })
})

export const Save = Effect(({ name, code }) => {
    codes[name] = code
    db.collection(FIREBASE_COLLECTION)
        .doc(ids[name])
        .set({ name, code })
})

export const Rename = Effect(({ oldName, newName, action }, dispatch) => {
    const code = codes[oldName]
    const id = ids[oldName]
    if (oldName === newName) return
    if (newName === '') {
        codes[''] = code
        delete ids[oldName]
        delete codes[oldName]
        dispatch(action, newName)
        db.collection(FIREBASE_COLLECTION)
            .doc(id)
            .delete()
            .then(_ => {
                return db
                    .collection(FIREBASE_COLLECTION)
                    .doc(ids[''])
                    .set({ name: '', code })
            })
    } else if (!!codes[newName]) {
        dispatch(action, oldName)
    } else if (oldName === '') {
        codes[newName] = code
        dispatch(action, newName)
        db.collection(FIREBASE_COLLECTION)
            .add({
                name: newName,
                code,
            })
            .then(doc => {
                ids[newName] = doc.id
            })
    } else {
        codes[newName] = code
        ids[newName] = id
        delete codes[oldName]
        delete ids[oldName]
        dispatch(action, newName)
        db.collection(FIREBASE_COLLECTION)
            .doc(id)
            .set({
                name: newName,
                code,
            })
    }
})

export const getCode = name => {
    return codes[name] || ''
}
