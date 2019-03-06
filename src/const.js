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
