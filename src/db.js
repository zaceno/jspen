import firebase from 'firebase/app'
import 'firebase/firestore'
import { FIREBASE_CONFIG, FIREBASE_COLLECTION } from './const'
try {
    firebase.initializeApp(FIREBASE_CONFIG)
} catch (err) {
    if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)
    }
}
const db = firebase.firestore()
firebase
    .firestore()
    .enablePersistence()
    .catch(e => {
        console.log(e)
    })

const docs = db.collection(FIREBASE_COLLECTION)
function all() {
    return docs.get().then(snaps => {
        let data = []
        snaps.forEach(doc => data.push([doc.id, doc.data()]))
        return data
    })
}

function create(data) {
    return docs.add(data).then(doc => {
        return doc.id
    })
}
function update(id, data) {
    return docs
        .doc(id)
        .set(data)
        .then(_ => id)
}
function remove(id) {
    return docs.doc(id).delete()
}

export { all, create, update, remove }
