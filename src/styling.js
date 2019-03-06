const sheet = document.head.appendChild(document.createElement('style')).sheet

export const style = outputId => cssText => {
    ;(cssText + ' ')
        .split('}')
        .slice(0, -1)
        .map(rule => rule.split('{'))
        .map(([sel, dir]) => [
            sel
                .replace(/\n/g, '')
                .split(',')
                .map(s => `#${outputId} ${s}`)
                .join(','),
            dir,
        ])
        .map(([sel, dir]) => `${sel} {${dir}}`)
        .forEach(rule => sheet.insertRule(rule, sheet.cssRules.length))
}

export const reset = () => {
    while (sheet.cssRules.length) {
        sheet.deleteRule(0)
    }
}
