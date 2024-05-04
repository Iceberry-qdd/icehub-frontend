import renderMathInElement from "katex/contrib/auto-render/auto-render"
import 'katex/dist/katex.min.css'

const parse = new DOMParser()
const params = {
    // customised options
    // • auto-render specific keys, e.g.:
    delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: "\\(", right: "\\)", display: false},
        {left: "\\begin{equation}", right: "\\end{equation}", display: true},
        {left: "\\begin{align}", right: "\\end{align}", display: true},
        {left: "\\begin{alignat}", right: "\\end{alignat}", display: true},
        {left: "\\begin{gather}", right: "\\end{gather}", display: true},
        {left: "\\begin{CD}", right: "\\end{CD}", display: true},
        {left: "\\[", right: "\\]", display: true}
    ],
    // • rendering keys, e.g.:
    throwOnError : false
}
export const katexExt = {
    type: 'output',
    filter: function(text, converter, options){
        const node = parse.parseFromString(text, 'text/html').body
        renderMathInElement(node, params)
        return node.innerHTML
    }
}