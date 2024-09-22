import Prism from 'prismjs'
import 'prismjs/components/prism-asciidoc'
import 'prismjs/components/prism-aspnet'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-basic'
import 'prismjs/components/prism-batch'
import 'prismjs/components/prism-brainfuck'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-clojure'
import 'prismjs/components/prism-cmake'
import 'prismjs/components/prism-cobol'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-csv'
import 'prismjs/components/prism-dart'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-elixir'
import 'prismjs/components/prism-erlang'
import 'prismjs/components/prism-fortran'
import 'prismjs/components/prism-git'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-go-module'
import 'prismjs/components/prism-gradle'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-groovy'
import 'prismjs/components/prism-haskell'
import 'prismjs/components/prism-hcl'
import 'prismjs/components/prism-ini'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javastacktrace'
import 'prismjs/components/prism-jq'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-json5'
import 'prismjs/components/prism-jsonp'
import 'prismjs/components/prism-jsstacktrace'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-julia'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-latex'
import 'prismjs/components/prism-less'
import 'prismjs/components/prism-lisp'
import 'prismjs/components/prism-lua'
import 'prismjs/components/prism-makefile'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-matlab'
import 'prismjs/components/prism-mermaid'
import 'prismjs/components/prism-n4js'
import 'prismjs/components/prism-nginx'
import 'prismjs/components/prism-objectivec'
import 'prismjs/components/prism-pascal'
import 'prismjs/components/prism-pascaligo'
import 'prismjs/components/prism-perl'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-plant-uml'
import 'prismjs/components/prism-powershell'
import 'prismjs/components/prism-properties'
import 'prismjs/components/prism-protobuf'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-regex'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sass'
import 'prismjs/components/prism-scala'
import 'prismjs/components/prism-smali'
import 'prismjs/components/prism-solidity'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-scala'
import 'prismjs/components/prism-toml'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-v'
import 'prismjs/components/prism-vbnet'
import 'prismjs/components/prism-verilog'
import 'prismjs/components/prism-visual-basic'
import 'prismjs/components/prism-wasm'
import 'prismjs/components/prism-yaml'

const parse = new DOMParser()
const supportedLanguages = Object.getOwnPropertyNames(Prism.languages)

export const highlightExt = {
    type: 'output',
    filter: function (text, converter, options) {
        const node = parse.parseFromString(text, 'text/html').body
        node.querySelectorAll('pre>code')
        .forEach((value, key, parent) => {
                const originLang = value.classList.item(0) || 'text'
                const displayLang = supportedLanguages.find(it => it === originLang.toLowerCase())
                const parseLang = displayLang || 'text'
                value.setAttribute('data-lang', displayLang || originLang)
                value.innerHTML = Prism.highlight(value.textContent, Prism.languages[parseLang], parseLang)
            })
        return node.innerHTML
    }
}