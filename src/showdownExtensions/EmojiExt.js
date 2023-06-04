import emojiPack from 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/+esm'

export const emojiExt = {
    type: 'lang',
    filter: function (text, converter, options) {
        text = text.replace(/:[a-zA-Z_]+:/gm, function (match, content) {
            const name = match.replaceAll(':', '')
            const bgPosition = calcSpriteSheet(...getEmojiLocation(name))
            return `<button title="${name}" class="emoji w-[2rem] h-[2rem] p-1">
                        <span style="background-position: ${bgPosition}"
                            class="w-[22px] h-[22px] bg-[length:6100%_6100%]
                            bg-[url('https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.0.0/img/apple/sheets-256/64.png')]">
                        </span>
                    </button>`
        })
        return text
    }
}

function calcSpriteSheet(sheet_x, sheet_y) {
    return `${100 / 60 * sheet_x}% ${100 / 60 * sheet_y}%`
}

function getEmojiLocation(emojiShortName) {
    const emoji = emojiPack.filter(e => e.has_img_apple === true && e.short_name == emojiShortName).at(0) || null
    return emoji == null ? [10, 41] : [emoji.sheet_x, emoji.sheet_y]
}