import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/keymap/sublime'
export const EDITOR_OPTIONS = {
    mode: 'javascript',
    theme: 'base16-light',
    indentUnit: 4,
    lineNumbers: true,
    keyMap: 'sublime',
}
export const STORAGE_KEY = 'jspen'
export const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyDu6WmqKggBQwMW1-aiZAw6x3e_hvmYJJU',
    authDomain: 'jspen-19e27.firebaseapp.com',
    databaseURL: 'https://jspen-19e27.firebaseio.com',
    projectId: 'jspen-19e27',
    storageBucket: '',
    messagingSenderId: '532334699690',
}
