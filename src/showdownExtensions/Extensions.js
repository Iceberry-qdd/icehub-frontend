import { atSignExt } from "./AtSignExt"
import { emojiExt } from "./EmojiExt"
import { katexExt } from "./katexExt"

export const extensions = () => {
    return [atSignExt, katexExt, emojiExt]
}