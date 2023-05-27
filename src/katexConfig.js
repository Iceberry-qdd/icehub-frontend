import renderMathInElement from "https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/contrib/auto-render.mjs"

export function renderMath(){
    const element = document.querySelector('markdown') || document.body
    renderMathInElement(element, {
        // customised options
        // • auto-render specific keys, e.g.:
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
        ],
        // • rendering keys, e.g.:
        throwOnError : false
      })
}