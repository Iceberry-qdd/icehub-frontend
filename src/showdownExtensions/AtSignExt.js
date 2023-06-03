import { calcBgColor } from "../utils/formatUtils"

export const atSignExt = {
    type: 'lang',
    filter: function (text, converter, options) {
        text = text.replace(/@[^@\s]+/gm, function (match, content) {
            const name = match.replaceAll('@', '')
            const bgColor = calcBgColor(name)
            const link = `http://icehub.com:5173/profile/${name}`
            return `<a href="${link}" style="text-decoration:none;">
                        <AtSign href="${link}" name="${name}" style="background-color:${bgColor};">@${name}</AtSign>
                    </a>`
        })
        return text
    }
}