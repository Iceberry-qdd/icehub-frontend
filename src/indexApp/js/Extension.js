import { katexExt } from "@/indexApp/extensions/katexExt.js"
import { domCleanExt } from "@/indexApp/extensions/DomCleanExt.js"
import { highlightExt } from "@/indexApp/extensions/CodeHighlightExt.js"

export const extensions = () => {
    return [highlightExt, katexExt, domCleanExt]
}