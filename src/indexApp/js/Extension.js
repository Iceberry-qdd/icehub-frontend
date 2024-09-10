import { katexExt } from "@/indexApp/extensions/katexExt.js"
import { domCleanExt } from "@/indexApp/extensions/DomCleanExt.js"

export const extensions = () => {
    return [katexExt, domCleanExt]
}