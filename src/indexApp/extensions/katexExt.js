import showdownKatex from "showdown-katex"

export const katexExt = (showdownKatex({
    displayMode: true,
    throwOnError: false,
    errorColor: '#ff0000',
    delimiters: [
        { left: '$', right: '$', display: false },
        { left: '~', right: '~', display: true, asciimath: true },
    ]
}))()[0]